/**
 * Ecosystem Observer - Fase 4
 * Observador de Ecossistema com checkEcosystem, findDuplicates, healthReport
 *
 * PLAN-F4: Observador Proativo
 * SPEC-SEC-4.2: Observador de Ecossistema
 */
import { diagnoseAgent, type DiagnosisResult } from "./diagnose-agent";

// ============================================
// TYPES
// ============================================
export interface DuplicateInfo {
  pattern: string;
  agents: string[];
  frequency: number;
  suggestion: string;
}

export interface EcosystemReport {
  timestamp: string;
  totalAgents: number;
  healthyAgents: number;
  unhealthyAgents: number;
  averageHealth: number;
  duplicates: DuplicateInfo[];
  issues: string[];
  suggestions: string[];
}

export interface EcosystemResult {
  report: EcosystemReport;
  text: string;
  diagnoses: DiagnosisResult[];
}

// ============================================
// HELPERS
// ============================================
const HEALTHY_THRESHOLD = 6;

function extractAgentId(content: string): string {
  const m = content.match(/id:\s*['"]([^'"]+)['"]/);
  return m ? m[1] : "unknown";
}

/** Extrai instructionsPrompt sem regex (indexOf + substring) */
function extractInstructionsPrompt(content: string): string {
  const marker = "instructionsPrompt:";
  const idx = content.indexOf(marker);
  if (idx === -1) return "";

  let pos = idx + marker.length;
  while (pos < content.length && (content[pos] === " " || content[pos] === "\t")) pos++;

  const def = "PROMPT_DEFENSE + ";
  if (content.substring(pos, pos + def.length) === def) {
    pos += def.length;
  }
  while (pos < content.length && (content[pos] === " " || content[pos] === "\t")) pos++;

  if (pos >= content.length || content[pos] !== "`") return "";
  pos++;

  const close = content.indexOf("`", pos);
  if (close === -1) return "";

  return content.substring(pos, close).trim();
}

/** Extrai conceitos de um agente usando indexOf para ser imune a problemas de compilacao */
function extractConcepts(content: string): string[] {
  const prompt = extractInstructionsPrompt(content);
  if (!prompt) return [];

  const result: string[] = [];
  const seen = new Set<string>();

  // 1. Extrair titulos de secao (## Process, ## Best Practices, etc)
  {
    let cursor = 0;
    while (true) {
      const h = prompt.indexOf("## ", cursor);
      if (h === -1) break;
      const start = h + 3;
      const end = prompt.indexOf("\n", start);
      const title = prompt.substring(start, end === -1 ? prompt.length : end).trim();
      if (title.length > 3 && title.length < 100 && !seen.has(title.toLowerCase())) {
        seen.add(title.toLowerCase());
        result.push(title.charAt(0).toUpperCase() + title.slice(1));
      }
      cursor = end === -1 ? prompt.length : end;
    }
  }

  // 2. Extrair padroes "is an expert", "specialized in", etc.
  {
    const patterns = [
      "is an ", "is a ", "specialized in ", "specializes in ",
      "focused on ", "expert ",
    ];
    const lower = prompt.toLowerCase();
    for (const pat of patterns) {
      let c = 0;
      while (true) {
        const p = lower.indexOf(pat, c);
        if (p === -1) break;
        const start = p + pat.length;
        let end = start;
        while (end < prompt.length && !/[\n\r.,;!?]/.test(prompt[end])) end++;
        const val = prompt.substring(start, end).trim();
        if (val.length > 3 && val.length < 100) {
          const words = val.split(/\s+/);
          const concept = words.slice(0, 3).join(" ");
          const key = concept.toLowerCase();
          if (!seen.has(key)) {
            seen.add(key);
            result.push(concept.charAt(0).toUpperCase() + concept.slice(1));
          }
        }
        c = end;
      }
    }
  }

  return result;
}

// ============================================
// PUBLIC FUNCTIONS
// ============================================
export function analyzeEcosystem(agentContents: string[]): EcosystemReport {
  const timestamp = new Date().toISOString();

  if (agentContents.length === 0) {
    return { timestamp, totalAgents: 0, healthyAgents: 0, unhealthyAgents: 0, averageHealth: 0, duplicates: [], issues: [], suggestions: [] };
  }

  const diagnoses: DiagnosisResult[] = agentContents.map((content, i) => {
    const agentId = extractAgentId(content);
    return diagnoseAgent(content, agentId || "agent-" + i);
  });

  const totalAgents = diagnoses.length;
  const healthyAgents = diagnoses.filter((d) => d.healthScore >= HEALTHY_THRESHOLD).length;
  const unhealthyAgents = totalAgents - healthyAgents;
  const averageHealth = totalAgents > 0 ? Math.round((diagnoses.reduce((sum, d) => sum + d.healthScore, 0) / totalAgents) * 10) / 10 : 0;

  const issues: string[] = [];
  const suggestions: string[] = [];
  for (const diag of diagnoses) {
    for (const issue of diag.issues) issues.push("[" + diag.displayName + "] " + issue.description);
    for (const suggestion of diag.suggestions) suggestions.push("[" + diag.displayName + "] " + suggestion);
  }

  const duplicates = findDuplicates(agentContents);
  return { timestamp, totalAgents, healthyAgents, unhealthyAgents, averageHealth, duplicates, issues, suggestions };
}

export function findDuplicates(agentContents: string[]): DuplicateInfo[] {
  if (agentContents.length < 2) return [];

  const agentConcepts: { id: string; concepts: string[] }[] = agentContents.map((content) => ({
    id: extractAgentId(content),
    concepts: extractConcepts(content),
  }));

  const conceptMap = new Map<string, Set<string>>();
  for (const { id, concepts } of agentConcepts) {
    for (const concept of concepts) {
      const normalized = concept.toLowerCase().trim();
      if (!conceptMap.has(normalized)) {
        conceptMap.set(normalized, new Set());
      }
      conceptMap.get(normalized)!.add(id);
    }
  }

  const duplicates: DuplicateInfo[] = [];
  for (const [normalized, agentSet] of conceptMap) {
    if (agentSet.size >= 2) {
      const originalConcept = agentConcepts.flatMap((a) => a.concepts).find((c) => c.toLowerCase().trim() === normalized);
      duplicates.push({
        pattern: originalConcept ?? normalized,
        agents: Array.from(agentSet),
        frequency: agentSet.size,
        suggestion: "Consolidar \"" + (originalConcept ?? normalized) + "\" em skill ou padrão compartilhado (" + agentSet.size + " agentes afetados)",
      });
    }
  }

  return duplicates.sort((a, b) => b.frequency - a.frequency);
}

export function generateHealthReport(report: EcosystemReport): string {
  const lines: string[] = [];
  lines.push("Relatorio do Observador");
  lines.push("Data: " + new Date(report.timestamp).toLocaleString("pt-BR"));
  lines.push("");
  lines.push("--- Resumo do Ecossistema ---");
  lines.push("Total de agentes: " + report.totalAgents);
  lines.push("Saudaveis: " + report.healthyAgents);
  lines.push("Com problemas: " + report.unhealthyAgents);
  lines.push("Saude media: " + report.averageHealth + "/10");
  lines.push("");

  if (report.totalAgents === 0) {
    lines.push("Nenhum agente encontrado no ecossistema.");
    lines.push("");
    return lines.join("\n");
  }

  if (report.unhealthyAgents === 0 && report.healthyAgents > 0) {
    lines.push("Ecossistema saudavel! Todos os agentes estao em boas condicoes.");
  } else {
    const pct = Math.round((report.unhealthyAgents / report.totalAgents) * 100);
    lines.push(pct + "% dos agentes precisam de atencao.");
  }
  lines.push("");

  if (report.duplicates.length > 0) {
    lines.push("--- Padroes Duplicados (" + report.duplicates.length + ") ---");
    lines.push("");
    for (const dup of report.duplicates) {
      lines.push('  "' + dup.pattern + '"');
      lines.push("     Agentes: " + dup.agents.join(", "));
      lines.push("     Frequencia: " + dup.frequency + "x");
      lines.push("     Sugestao: " + dup.suggestion);
      lines.push("");
    }
  }

  if (report.issues.length > 0) {
    lines.push("--- Problemas Encontrados (" + report.issues.length + ") ---");
    lines.push("");
    for (const issue of report.issues) lines.push("  " + issue);
    lines.push("");
  }

  if (report.suggestions.length > 0) {
    lines.push("--- Sugestoes de Melhoria (" + report.suggestions.length + ") ---");
    lines.push("");
    for (const s of report.suggestions) lines.push("  " + s);
    lines.push("");
  }

  lines.push("--- Fim do Relatorio ---");
  return lines.join("\n");
}

export function checkEcosystem(agentContents: string[]): EcosystemResult {
  const report = analyzeEcosystem(agentContents);
  const text = generateHealthReport(report);
  const diagnoses: DiagnosisResult[] = agentContents.map((content, i) => {
    const agentId = extractAgentId(content);
    return diagnoseAgent(content, agentId || "agent-" + i);
  });
  return { report, text, diagnoses };
}
