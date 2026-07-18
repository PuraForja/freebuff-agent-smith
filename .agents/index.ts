/**
 * Agent Registry — Combines ECC and Custom agents
 * 
 * ECC agents: Converted from the ECC (Everything Claude Code) project
 * Custom agents: Created specifically for Freebuff
 */

import type { AgentDefinition } from './types/agent-definition'

// ECC Agents (auto-generated from ECC/agents/*.md)
import a11yArchitect from './ecc/a11y-architect'
import agentEvaluator from './ecc/agent-evaluator'
import architect from './ecc/architect'
import buildErrorResolver from './ecc/build-error-resolver'
import chiefOfStaff from './ecc/chief-of-staff'
import codeArchitect from './ecc/code-architect'
import codeExplorer from './ecc/code-explorer'
import codeReviewer from './ecc/code-reviewer'
import codeSimplifier from './ecc/code-simplifier'
import commentAnalyzer from './ecc/comment-analyzer'
import conversationAnalyzer from './ecc/conversation-analyzer'
import cppBuildResolver from './ecc/cpp-build-resolver'
import cppReviewer from './ecc/cpp-reviewer'
import csharpReviewer from './ecc/csharp-reviewer'
import dartBuildResolver from './ecc/dart-build-resolver'
import databaseReviewer from './ecc/database-reviewer'
import djangoBuildResolver from './ecc/django-build-resolver'
import djangoReviewer from './ecc/django-reviewer'
import docUpdater from './ecc/doc-updater'
import docsLookup from './ecc/docs-lookup'
import e2eRunner from './ecc/e2e-runner'
import fastapiReviewer from './ecc/fastapi-reviewer'
import flutterReviewer from './ecc/flutter-reviewer'
import fsharpReviewer from './ecc/fsharp-reviewer'
import ganEvaluator from './ecc/gan-evaluator'
import ganGenerator from './ecc/gan-generator'
import ganPlanner from './ecc/gan-planner'
import goBuildResolver from './ecc/go-build-resolver'
import goReviewer from './ecc/go-reviewer'
import harnessOptimizer from './ecc/harness-optimizer'
import harmonyosAppResolver from './ecc/harmonyos-app-resolver'
import healthcareReviewer from './ecc/healthcare-reviewer'
import homelabArchitect from './ecc/homelab-architect'
import javaBuildResolver from './ecc/java-build-resolver'
import javaReviewer from './ecc/java-reviewer'
import kotlinBuildResolver from './ecc/kotlin-build-resolver'
import kotlinReviewer from './ecc/kotlin-reviewer'
import loopOperator from './ecc/loop-operator'
import marketingAgent from './ecc/marketing-agent'
import mleReviewer from './ecc/mle-reviewer'
import networkArchitect from './ecc/network-architect'
import networkConfigReviewer from './ecc/network-config-reviewer'
import networkTroubleshooter from './ecc/network-troubleshooter'
import opensourceForker from './ecc/opensource-forker'
import opensourcePackager from './ecc/opensource-packager'
import opensourceSanitizer from './ecc/opensource-sanitizer'
import performanceOptimizer from './ecc/performance-optimizer'
import phpReviewer from './ecc/php-reviewer'
import planner from './ecc/planner'
import prTestAnalyzer from './ecc/pr-test-analyzer'
import pytorchBuildResolver from './ecc/pytorch-build-resolver'
import pythonReviewer from './ecc/python-reviewer'
import reactBuildResolver from './ecc/react-build-resolver'
import reactReviewer from './ecc/react-reviewer'
import refactorCleaner from './ecc/refactor-cleaner'
import rustBuildResolver from './ecc/rust-build-resolver'
import rustReviewer from './ecc/rust-reviewer'
import securityReviewer from './ecc/security-reviewer'
import seoSpecialist from './ecc/seo-specialist'
import silentFailureHunter from './ecc/silent-failure-hunter'
import specMiner from './ecc/spec-miner'
import swiftBuildResolver from './ecc/swift-build-resolver'
import swiftReviewer from './ecc/swift-reviewer'
import tddGuide from './ecc/tdd-guide'
import typeDesignAnalyzer from './ecc/type-design-analyzer'
import typescriptReviewer from './ecc/typescript-reviewer'
import vueReviewer from './ecc/vue-reviewer'

// Custom agents (created for Freebuff)
import agentSmith from './custom/agent-smith'
import govDataDownloader from './custom/gov-data-downloader'

// F1a: Smith Types (Artifact, Lineage, Patch, Knowledge)
export type { Artifact } from './types/artifact'
export type { Lineage, LineageStore } from './types/lineage'
export { InMemoryLineageStore, registerLineage, getLineage, listLineages } from './types/lineage'
export type { Patch, PatchSummary } from './types/patch'
export { toPatchSummary, isPatchRemovable } from './types/patch'
export type { Knowledge } from './types/knowledge'
export { createKnowledge, validateQuality, validateConfidence, knowledgeToJSON } from './types/knowledge'

// F2: Destilador de Conhecimento (DNA Extractor)
export type { DnaExtractionResult } from './types/extract-dna'
export { extractAgentDna, extractDnaFromContent, batchExtractDna, extractAllDna, dnaToKnowledge } from './types/extract-dna'

// F2: Descobridor Remoto (GitHub API)
export type { RepoIdentifier, RemoteAgentFile, DiscoverOptions } from './types/discover-remote'
export { parseGitHubUrl, discoverRemoteAgents, clearDiscoveryCache } from './types/discover-remote'

// F2: Comparacao e Recomendacao
export type { AgentOption, ComparisonResult } from './types/compare-options'
export { compareOptions, sortByQuality, suggestBestOption, formatComparisonTable, calculateCompositeScore } from './types/compare-options'

// F3: Patch Manager
export type { CreatePatchData, PatchFilter, CompatibilityResult, PatchStore } from './types/patch-manager'
export { createPatch, listPatches, getPatch, removePatch, checkCompatibility, verifyAllPatches, applyPatch, InMemoryPatchStore, FileSystemPatchStore } from './types/patch-manager'

// F3: Diagnostico de Agentes
export type { DiagnosisResult, DiagnosisIssue } from './types/diagnose-agent'
export { diagnoseAgent } from './types/diagnose-agent'

// F4: Observador de Ecossistema
export type { EcosystemReport, EcosystemResult, DuplicateInfo } from './types/ecosystem-observer'
export { analyzeEcosystem, findDuplicates, generateHealthReport, checkEcosystem } from './types/ecosystem-observer'

// Combined registry
export const agents: AgentDefinition[] = [
  // ECC Agents
  a11yArchitect,
  agentEvaluator,
  architect,
  buildErrorResolver,
  chiefOfStaff,
  codeArchitect,
  codeExplorer,
  codeReviewer,
  codeSimplifier,
  commentAnalyzer,
  conversationAnalyzer,
  cppBuildResolver,
  cppReviewer,
  csharpReviewer,
  dartBuildResolver,
  databaseReviewer,
  djangoBuildResolver,
  djangoReviewer,
  docUpdater,
  docsLookup,
  e2eRunner,
  fastapiReviewer,
  flutterReviewer,
  fsharpReviewer,
  ganEvaluator,
  ganGenerator,
  ganPlanner,
  goBuildResolver,
  goReviewer,
  harnessOptimizer,
  harmonyosAppResolver,
  healthcareReviewer,
  homelabArchitect,
  javaBuildResolver,
  javaReviewer,
  kotlinBuildResolver,
  kotlinReviewer,
  loopOperator,
  marketingAgent,
  mleReviewer,
  networkArchitect,
  networkConfigReviewer,
  networkTroubleshooter,
  opensourceForker,
  opensourcePackager,
  opensourceSanitizer,
  performanceOptimizer,
  phpReviewer,
  planner,
  prTestAnalyzer,
  pytorchBuildResolver,
  pythonReviewer,
  reactBuildResolver,
  reactReviewer,
  refactorCleaner,
  rustBuildResolver,
  rustReviewer,
  securityReviewer,
  seoSpecialist,
  silentFailureHunter,
  specMiner,
  swiftBuildResolver,
  swiftReviewer,
  tddGuide,
  typeDesignAnalyzer,
  typescriptReviewer,
  vueReviewer,
  
  // Custom Agents
  agentSmith,
  govDataDownloader,
]

// Helper to find agent by ID
export function getAgent(id: string): AgentDefinition | undefined {
  return agents.find(a => a.id === id)
}

// Helper to list all agent IDs
export function listAgentIds(): string[] {
  return agents.map(a => a.id)
}

// Categorized exports
export const eccAgents = agents.filter(a => !['agent-smith', 'gov-data-downloader'].includes(a.id))
export const customAgents = agents.filter(a => ['agent-smith', 'gov-data-downloader'].includes(a.id))

export default agents
