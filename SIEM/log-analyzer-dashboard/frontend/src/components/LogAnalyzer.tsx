import { useState, useEffect } from 'react'
import { FileText, AlertTriangle, Shield, Download, Loader2, History, Clock, CheckCircle2, XCircle, BarChart3, Repeat } from 'lucide-react'
import axios from 'axios'
import jsPDF from 'jspdf'

interface LogAnalysis {
  summary: string
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  confidence: 'low' | 'medium' | 'high'
  impact: string
  recommendedActions: string[]
  nextChecks: string[]
  evidences: string[]
  responseProcedure: string[]
  timestamp: string
  eventId?: string
  eventName?: string
  isMultiple?: boolean
  correlations?: Array<{
    id: string
    type: string
    description: string
    eventIndices: number[]
    severity: string
  }>
}

interface MultipleLogAnalysis {
  summary: string
  statistics: {
    totalEvents: number
    riskDistribution: {
      critical: number
      high: number
      medium: number
      low: number
    }
    repeatedEvents: Array<{
      eventId: string
      eventName: string
      count: number
      riskLevel: string
    }>
    uniqueEvents: number
    correlations: number
    groupedEvents: number
  }
  individualAnalyses: Array<LogAnalysis & { logLine: string }>
  groupedEvents: Array<{
    key: string
    eventId: string
    eventName: string
    riskLevel: string
    confidence: string
    summary: string
    impact: string
    recommendedActions: string[]
    nextChecks: string[]
    evidences: string[]
    responseProcedure: string[]
    correlations: Array<{
      id: string
      type: string
      description: string
      eventIndices: number[]
      severity: string
    }>
    count: number
    indices: number[]
    logLines: string[]
    firstLogLine: string
  }>
  repeatedEvents: Array<{
    eventId: string
    eventName: string
    count: number
    riskLevel: string
  }>
  correlations: Array<{
    id: string
    type: string
    description: string
    eventIndices: number[]
    severity: string
  }>
  timestamp: string
  isMultiple: true
}

interface HistoryItem {
  id: string
  timestamp: string
  log: string
  fileName?: string
  analysis: LogAnalysis | MultipleLogAnalysis
  riskLevel: string
}

// Componente para mostrar un análisis individual
function SingleAnalysisView({ analysis }: { analysis: LogAnalysis & { logLine?: string } }) {
  return (
    <div className="space-y-4">
      <div className="bg-slate-800 rounded-lg p-4">
        <p className="text-slate-400 text-sm font-mono">{analysis.logLine || 'Log no disponible'}</p>
      </div>
      
      <div className="bg-slate-800 rounded-lg p-4">
        <h4 className="text-cyan-400 font-semibold mb-2">RESUMEN</h4>
        <p className="text-slate-200">{analysis.summary}</p>
      </div>

      <div className="bg-slate-800 rounded-lg p-4">
        <h4 className="text-cyan-400 font-semibold mb-2">RIESGO</h4>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{getRiskEmoji(analysis.riskLevel)}</span>
          <span className={`text-xl font-bold ${getRiskColor(analysis.riskLevel)}`}>
            {getRiskText(analysis.riskLevel)}
          </span>
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg p-4">
        <h4 className="text-cyan-400 font-semibold mb-2">CONFIANZA</h4>
        <span className={`text-xl font-bold ${getConfidenceColor(analysis.confidence)}`}>
          {getConfidenceText(analysis.confidence)}
        </span>
      </div>

      <div className="bg-slate-800 rounded-lg p-4">
        <h4 className="text-cyan-400 font-semibold mb-2">POSIBLE IMPACTO</h4>
        <p className="text-slate-200">{analysis.impact}</p>
      </div>

      <div className="bg-slate-800 rounded-lg p-4">
        <h4 className="text-cyan-400 font-semibold mb-2">ACCIONES RECOMENDADAS</h4>
        <ul className="space-y-2">
          {analysis.recommendedActions.map((action, index) => (
            <li key={index} className="text-slate-200 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{action}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-slate-800 rounded-lg p-4">
        <h4 className="text-cyan-400 font-semibold mb-2">PRÓXIMAS VERIFICACIONES</h4>
        <ul className="space-y-2">
          {analysis.nextChecks.map((check, index) => (
            <li key={index} className="text-slate-200 flex items-start gap-2">
              <Clock className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{check}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-slate-800 rounded-lg p-4">
        <h4 className="text-cyan-400 font-semibold mb-2">EVIDENCIAS</h4>
        <ul className="space-y-2">
          {analysis.evidences.map((evidence, index) => (
            <li key={index} className="text-slate-200 flex items-start gap-2">
              <XCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
              <span className="font-mono text-sm">{evidence}</span>
            </li>
          ))}
        </ul>
      </div>

      {analysis.responseProcedure && analysis.responseProcedure.length > 0 && (
        <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 rounded-lg p-4 border border-purple-500">
          <h4 className="text-purple-300 font-semibold mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            PASOS A SEGUIR
          </h4>
          <ul className="space-y-3">
            {analysis.responseProcedure.map((step, index) => (
              <li key={index} className="text-slate-200 flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
                  {index + 1}
                </span>
                <span className="text-sm leading-relaxed">{step}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

// Helper functions moved outside component for use in SingleAnalysisView
function getRiskEmoji(level: string) {
  switch (level) {
    case 'low': return '🟢'
    case 'medium': return '🟡'
    case 'high': return '🟠'
    case 'critical': return '🔴'
    default: return '⚪'
  }
}

function getRiskText(level: string) {
  switch (level) {
    case 'low': return 'BAJO'
    case 'medium': return 'MEDIO'
    case 'high': return 'ALTO'
    case 'critical': return 'CRÍTICO'
    default: return 'DESCONOCIDO'
  }
}

function getRiskColor(level: string) {
  switch (level) {
    case 'low': return 'text-green-400'
    case 'medium': return 'text-yellow-400'
    case 'high': return 'text-orange-400'
    case 'critical': return 'text-red-400'
    default: return 'text-gray-400'
  }
}

function getConfidenceColor(level: string) {
  switch (level) {
    case 'high': return 'text-green-400'
    case 'medium': return 'text-yellow-400'
    case 'low': return 'text-red-400'
    default: return 'text-gray-400'
  }
}

function getConfidenceText(level: string) {
  switch (level) {
    case 'high': return 'ALTA'
    case 'medium': return 'MEDIA'
    case 'low': return 'BAJA'
    default: return 'DESCONOCIDA'
  }
}

export default function LogAnalyzer() {
  const [logInput, setLogInput] = useState('')
  const [analysis, setAnalysis] = useState<LogAnalysis | MultipleLogAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fileName, setFileName] = useState('')
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [selectedAnalysis, setSelectedAnalysis] = useState<number | null>(null)
  const [showGroupedView, setShowGroupedView] = useState(true)
  const [expandedGroups, setExpandedGroups] = useState<Set<number>>(new Set())
  const [selectedForExport, setSelectedForExport] = useState<Set<number>>(new Set())

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('logAnalysisHistory')
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory))
    }
  }, [])

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('logAnalysisHistory', JSON.stringify(history))
  }, [history])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
      const reader = new FileReader()
      reader.onload = (event) => {
        setLogInput(event.target?.result as string)
      }
      reader.readAsText(file)
    }
  }

  const analyzeLog = async () => {
    if (!logInput.trim()) {
      setError('Por favor, ingresa o carga un log para analizar')
      return
    }

    setLoading(true)
    setError('')
    setAnalysis(null)
    setSelectedAnalysis(null)

    try {
      const response = await axios.post('/api/analyze', { log: logInput })
      const analysisData = response.data
      setAnalysis(analysisData)
      
      // Add to history
      const historyItem: HistoryItem = {
        id: Date.now().toString(),
        timestamp: analysisData.timestamp || new Date().toISOString(),
        log: logInput,
        fileName: fileName || undefined,
        analysis: analysisData,
        riskLevel: 'riskLevel' in analysisData ? analysisData.riskLevel : 'low'
      }
      setHistory(prev => [historyItem, ...prev].slice(0, 50)) // Keep last 50 items
    } catch (err) {
      setError('Error al analizar el log. Por favor, intenta nuevamente.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const loadFromHistory = (item: HistoryItem) => {
    setLogInput(item.log)
    setAnalysis(item.analysis)
    setFileName(item.fileName || '')
    setShowHistory(false)
    setSelectedAnalysis(null)
  }

  const clearHistory = () => {
    if (confirm('¿Estás seguro de que quieres borrar todo el historial?')) {
      setHistory([])
      localStorage.removeItem('logAnalysisHistory')
    }
  }

  const clearAll = () => {
    setLogInput('')
    setAnalysis(null)
    setError('')
    setFileName('')
    setSelectedAnalysis(null)
  }

  const exportToPDF = (selectedIndices?: number[]) => {
    if (!analysis) return

    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 20
    let y = margin

    // Función auxiliar para agregar nueva página si es necesario
    const checkAndAddPage = (requiredSpace: number) => {
      if (y + requiredSpace > pageHeight - margin) {
        doc.addPage()
        y = margin
      }
    }

    // Check if it's multiple analysis
    if ('isMultiple' in analysis && analysis.isMultiple) {
      const multiAnalysis = analysis as MultipleLogAnalysis
      const analysesToExport = selectedIndices && selectedIndices.length > 0
        ? multiAnalysis.individualAnalyses.filter((_, index) => selectedIndices.includes(index))
        : multiAnalysis.individualAnalyses

      analysesToExport.forEach((indAnalysis, index) => {
        // Agregar nueva página para cada evento si hay más de uno
        if (index > 0) {
          doc.addPage()
          y = margin
        }

        // 1. INFORMACIÓN GENERAL
        checkAndAddPage(80)
        doc.setFontSize(16)
        doc.setFont('helvetica', 'bold')
        doc.text('1. INFORMACIÓN GENERAL', margin, y)
        y += 10
        doc.setFontSize(11)
        doc.setFont('helvetica', 'normal')
        doc.text(`Fecha de análisis: ${new Date(analysis.timestamp).toLocaleString()}`, margin, y)
        y += 7
        if (fileName) {
          doc.text(`Archivo de origen: ${fileName}`, margin, y)
          y += 7
        }
        doc.text(`ID del evento: ${indAnalysis.eventId || 'N/A'}`, margin, y)
        y += 7
        doc.text(`Nombre del evento: ${indAnalysis.eventName || 'Evento desconocido'}`, margin, y)
        y += 7
        doc.text(`Confianza del análisis: ${indAnalysis.confidence?.toUpperCase() || 'N/A'}`, margin, y)
        y += 15

        // 2. RESUMEN EJECUTIVO
        checkAndAddPage(50)
        doc.setFontSize(16)
        doc.setFont('helvetica', 'bold')
        doc.text('2. RESUMEN EJECUTIVO', margin, y)
        y += 10
        doc.setFontSize(11)
        doc.setFont('helvetica', 'normal')
        const summaryLines = doc.splitTextToSize(indAnalysis.summary || 'Sin resumen disponible', pageWidth - 2 * margin)
        doc.text(summaryLines, margin, y)
        y += summaryLines.length * 6 + 15

        // 3. DESCRIPCIÓN DEL EVENTO
        checkAndAddPage(80)
        doc.setFontSize(16)
        doc.setFont('helvetica', 'bold')
        doc.text('3. DESCRIPCIÓN DEL EVENTO', margin, y)
        y += 10
        doc.setFontSize(11)
        doc.setFont('helvetica', 'normal')
        doc.text('Log original:', margin, y)
        y += 7
        const logLines = doc.splitTextToSize(indAnalysis.logLine, pageWidth - 2 * margin)
        doc.text(logLines, margin, y)
        y += logLines.length * 6 + 15

        // 4. EVIDENCIAS
        checkAndAddPage(50)
        doc.setFontSize(16)
        doc.setFont('helvetica', 'bold')
        doc.text('4. EVIDENCIAS', margin, y)
        y += 10
        doc.setFontSize(11)
        doc.setFont('helvetica', 'normal')
        if (indAnalysis.evidences && indAnalysis.evidences.length > 0) {
          indAnalysis.evidences.forEach((evidence, evidenceIndex) => {
            checkAndAddPage(20)
            const evidenceLines = doc.splitTextToSize(`${evidenceIndex + 1}. ${evidence}`, pageWidth - 2 * margin)
            doc.text(evidenceLines, margin, y)
            y += evidenceLines.length * 6 + 3
          })
        } else {
          doc.text('No se recopilaron evidencias adicionales.', margin, y)
          y += 7
        }
        y += 15

        // 5. CLASIFICACIÓN
        checkAndAddPage(50)
        doc.setFontSize(16)
        doc.setFont('helvetica', 'bold')
        doc.text('5. CLASIFICACIÓN', margin, y)
        y += 10
        doc.setFontSize(11)
        doc.setFont('helvetica', 'normal')
        doc.text(`Categoría: ${indAnalysis.eventName || 'Sin clasificar'}`, margin, y)
        y += 7
        doc.text(`Tipo: Análisis de seguridad de logs`, margin, y)
        y += 15

        // 6. SEVERIDAD
        checkAndAddPage(50)
        doc.setFontSize(16)
        doc.setFont('helvetica', 'bold')
        doc.text('6. SEVERIDAD', margin, y)
        y += 10
        doc.setFontSize(11)
        doc.setFont('helvetica', 'normal')
        const riskText = {
          low: 'BAJO',
          medium: 'MEDIO',
          high: 'ALTO',
          critical: 'CRÍTICO'
        }[indAnalysis.riskLevel]
        doc.text(`Nivel de riesgo: ${riskText}`, margin, y)
        y += 7
        doc.text(`Confianza: ${indAnalysis.confidence?.toUpperCase() || 'N/A'}`, margin, y)
        y += 15

        // 7. IMPACTO
        checkAndAddPage(50)
        doc.setFontSize(16)
        doc.setFont('helvetica', 'bold')
        doc.text('7. IMPACTO', margin, y)
        y += 10
        doc.setFontSize(11)
        doc.setFont('helvetica', 'normal')
        if (indAnalysis.impact) {
          const impactLines = doc.splitTextToSize(indAnalysis.impact, pageWidth - 2 * margin)
          doc.text(impactLines, margin, y)
          y += impactLines.length * 6 + 15
        } else {
          doc.text('No se evaluó el impacto específico de este evento.', margin, y)
          y += 15
        }

        // 8. RECOMENDACIONES
        checkAndAddPage(100)
        doc.setFontSize(16)
        doc.setFont('helvetica', 'bold')
        doc.text('8. RECOMENDACIONES', margin, y)
        y += 10
        doc.setFontSize(11)
        doc.setFont('helvetica', 'normal')
        if (indAnalysis.responseProcedure && indAnalysis.responseProcedure.length > 0) {
          indAnalysis.responseProcedure.forEach((step) => {
            checkAndAddPage(20)
            const stepLines = doc.splitTextToSize(step, pageWidth - 2 * margin)
            doc.text(stepLines, margin, y)
            y += stepLines.length * 6 + 3
          })
        } else {
          doc.text('No se proporcionaron recomendaciones específicas.', margin, y)
          y += 7
        }
        y += 15

        // 9. CONCLUSIÓN
        checkAndAddPage(50)
        doc.setFontSize(16)
        doc.setFont('helvetica', 'bold')
        doc.text('9. CONCLUSIÓN', margin, y)
        y += 10
        doc.setFontSize(11)
        doc.setFont('helvetica', 'normal')
        const conclusionText = `El evento "${indAnalysis.eventName || 'desconocido'}" ha sido analizado con un nivel de riesgo ${riskText}. Se recomienda seguir los pasos detallados en la sección de recomendaciones para mitigar cualquier potencial amenaza.`
        const conclusionLines = doc.splitTextToSize(conclusionText, pageWidth - 2 * margin)
        doc.text(conclusionLines, margin, y)
        y += conclusionLines.length * 6 + 15

        // Footer de página
        const pageNumber = doc.internal.pages.length - 1
        doc.setFontSize(9)
        doc.setFont('helvetica', 'italic')
        doc.text(`Página ${pageNumber} - Reporte de Análisis de Log - SOC`, pageWidth / 2, pageHeight - 10, { align: 'center' })
      })
    } else {
      // Single analysis
      const singleAnalysis = analysis as LogAnalysis
      
      // 1. INFORMACIÓN GENERAL
      checkAndAddPage(80)
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.text('1. INFORMACIÓN GENERAL', margin, y)
      y += 10
      doc.setFontSize(11)
      doc.setFont('helvetica', 'normal')
      doc.text(`Fecha de análisis: ${new Date(analysis.timestamp).toLocaleString()}`, margin, y)
      y += 7
      if (fileName) {
        doc.text(`Archivo de origen: ${fileName}`, margin, y)
        y += 7
      }
      doc.text(`ID del evento: ${singleAnalysis.eventId || 'N/A'}`, margin, y)
      y += 7
      doc.text(`Nombre del evento: ${singleAnalysis.eventName || 'Evento desconocido'}`, margin, y)
      y += 7
      doc.text(`Confianza del análisis: ${singleAnalysis.confidence?.toUpperCase() || 'N/A'}`, margin, y)
      y += 15

      // 2. RESUMEN EJECUTIVO
      checkAndAddPage(50)
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.text('2. RESUMEN EJECUTIVO', margin, y)
      y += 10
      doc.setFontSize(11)
      doc.setFont('helvetica', 'normal')
      const summaryLines = doc.splitTextToSize(singleAnalysis.summary || 'Sin resumen disponible', pageWidth - 2 * margin)
      doc.text(summaryLines, margin, y)
      y += summaryLines.length * 6 + 15

      // 3. DESCRIPCIÓN DEL EVENTO
      checkAndAddPage(80)
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.text('3. DESCRIPCIÓN DEL EVENTO', margin, y)
      y += 10
      doc.setFontSize(11)
      doc.setFont('helvetica', 'normal')
      doc.text('Log original:', margin, y)
      y += 7
      const logLines = doc.splitTextToSize(singleAnalysis.logLine || 'No disponible', pageWidth - 2 * margin)
      doc.text(logLines, margin, y)
      y += logLines.length * 6 + 15

      // 4. EVIDENCIAS
      checkAndAddPage(50)
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.text('4. EVIDENCIAS', margin, y)
      y += 10
      doc.setFontSize(11)
      doc.setFont('helvetica', 'normal')
      if (singleAnalysis.evidences && singleAnalysis.evidences.length > 0) {
        singleAnalysis.evidences.forEach((evidence, evidenceIndex) => {
          checkAndAddPage(20)
          const evidenceLines = doc.splitTextToSize(`${evidenceIndex + 1}. ${evidence}`, pageWidth - 2 * margin)
          doc.text(evidenceLines, margin, y)
          y += evidenceLines.length * 6 + 3
        })
      } else {
        doc.text('No se recopilaron evidencias adicionales.', margin, y)
        y += 7
      }
      y += 15

      // 5. CLASIFICACIÓN
      checkAndAddPage(50)
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.text('5. CLASIFICACIÓN', margin, y)
      y += 10
      doc.setFontSize(11)
      doc.setFont('helvetica', 'normal')
      doc.text(`Categoría: ${singleAnalysis.eventName || 'Sin clasificar'}`, margin, y)
      y += 7
      doc.text(`Tipo: Análisis de seguridad de logs`, margin, y)
      y += 15

      // 6. SEVERIDAD
      checkAndAddPage(50)
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.text('6. SEVERIDAD', margin, y)
      y += 10
      doc.setFontSize(11)
      doc.setFont('helvetica', 'normal')
      const riskText = {
        low: 'BAJO',
        medium: 'MEDIO',
        high: 'ALTO',
        critical: 'CRÍTICO'
      }[singleAnalysis.riskLevel]
      doc.text(`Nivel de riesgo: ${riskText}`, margin, y)
      y += 7
      doc.text(`Confianza: ${singleAnalysis.confidence?.toUpperCase() || 'N/A'}`, margin, y)
      y += 15

      // 7. IMPACTO
      checkAndAddPage(50)
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.text('7. IMPACTO', margin, y)
      y += 10
      doc.setFontSize(11)
      doc.setFont('helvetica', 'normal')
      if (singleAnalysis.impact) {
        const impactLines = doc.splitTextToSize(singleAnalysis.impact, pageWidth - 2 * margin)
        doc.text(impactLines, margin, y)
        y += impactLines.length * 6 + 15
      } else {
        doc.text('No se evaluó el impacto específico de este evento.', margin, y)
        y += 15
      }

      // 8. RECOMENDACIONES
      checkAndAddPage(100)
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.text('8. RECOMENDACIONES', margin, y)
      y += 10
      doc.setFontSize(11)
      doc.setFont('helvetica', 'normal')
      if (singleAnalysis.responseProcedure && singleAnalysis.responseProcedure.length > 0) {
        singleAnalysis.responseProcedure.forEach((step) => {
          checkAndAddPage(20)
          const stepLines = doc.splitTextToSize(step, pageWidth - 2 * margin)
          doc.text(stepLines, margin, y)
          y += stepLines.length * 6 + 3
        })
      } else {
        doc.text('No se proporcionaron recomendaciones específicas.', margin, y)
        y += 7
      }
      y += 15

      // 9. CONCLUSIÓN
      checkAndAddPage(50)
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.text('9. CONCLUSIÓN', margin, y)
      y += 10
      doc.setFontSize(11)
      doc.setFont('helvetica', 'normal')
      const conclusionText = `El evento "${singleAnalysis.eventName || 'desconocido'}" ha sido analizado con un nivel de riesgo ${riskText}. Se recomienda seguir los pasos detallados en la sección de recomendaciones para mitigar cualquier potencial amenaza.`
      const conclusionLines = doc.splitTextToSize(conclusionText, pageWidth - 2 * margin)
      doc.text(conclusionLines, margin, y)
      y += conclusionLines.length * 6 + 15

      // Footer de página
      const pageNumber = doc.internal.pages.length - 1
      doc.setFontSize(9)
      doc.setFont('helvetica', 'italic')
      doc.text(`Página ${pageNumber} - Reporte de Análisis de Log - SOC`, pageWidth / 2, pageHeight - 10, { align: 'center' })
    }

    // Guardar PDF
    doc.save(`reporte-analisis-soc-${new Date().toISOString().split('T')[0]}.pdf`)
  }

  const getRiskEmoji = (level: string) => {
    switch (level) {
      case 'low': return '🟢'
      case 'medium': return '🟡'
      case 'high': return '🟠'
      case 'critical': return '🔴'
      default: return '⚪'
    }
  }

  const getRiskText = (level: string) => {
    switch (level) {
      case 'low': return 'BAJO'
      case 'medium': return 'MEDIO'
      case 'high': return 'ALTO'
      case 'critical': return 'CRÍTICO'
      default: return 'DESCONOCIDO'
    }
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-400'
      case 'medium': return 'text-yellow-400'
      case 'high': return 'text-orange-400'
      case 'critical': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getConfidenceColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-green-400'
      case 'medium': return 'text-yellow-400'
      case 'low': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getConfidenceText = (level: string) => {
    switch (level) {
      case 'high': return 'ALTA'
      case 'medium': return 'MEDIA'
      case 'low': return 'BAJA'
      default: return 'DESCONOCIDA'
    }
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <Shield className="w-12 h-12 text-cyan-400" />
            Log Analyzer
          </h1>
          <p className="text-slate-400 text-lg">
            Dashboard de Análisis de Logs para SOC
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
              <FileText className="w-6 h-6 text-cyan-400" />
              Cargar Log
            </h2>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              <History className="w-4 h-4" />
              Historial ({history.length})
            </button>
          </div>

          {/* History Panel */}
          {showHistory && (
            <div className="mb-6 bg-slate-900/50 rounded-xl border border-slate-600 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Historial de Análisis</h3>
                <button
                  onClick={clearHistory}
                  className="text-sm text-red-400 hover:text-red-300"
                >
                  Borrar todo
                </button>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {history.length === 0 ? (
                  <p className="text-slate-400 text-sm">No hay análisis en el historial</p>
                ) : (
                  history.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => loadFromHistory(item)}
                      className="w-full text-left p-3 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{getRiskEmoji(item.riskLevel)}</span>
                        <span className={`font-semibold ${getRiskColor('riskLevel' in item.analysis ? item.analysis.riskLevel : 'low')}`}>
                          {getRiskText('riskLevel' in item.analysis ? item.analysis.riskLevel : 'low')}
                        </span>
                        <span className="text-slate-400 text-xs ml-auto">
                          {new Date('timestamp' in item.analysis ? item.analysis.timestamp : new Date().toISOString()).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-slate-300 text-sm truncate">{('summary' in item.analysis ? item.analysis.summary : 'Análisis múltiple')?.substring(0, 80)}...</p>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          {/* File Upload */}
          <div className="mb-6">
            <label className="block">
              <span className="sr-only">Seleccionar archivo</span>
              <input
                type="file"
                onChange={handleFileUpload}
                className="block w-full text-sm text-slate-400
                  file:mr-4 file:py-3 file:px-6
                  file:rounded-xl file:border-0
                  file:text-sm file:font-semibold
                  file:bg-cyan-500 file:text-white
                  hover:file:bg-cyan-600
                  file:cursor-pointer
                  cursor-pointer
                "
                accept=".log,.txt,.json"
              />
            </label>
            {fileName && (
              <p className="mt-2 text-sm text-cyan-400">
                Archivo seleccionado: {fileName}
              </p>
            )}
          </div>

          {/* Text Input */}
          <div className="mb-6">
            <label className="block text-slate-300 mb-2 font-medium">
              O pega el log manualmente:
            </label>
            <textarea
              value={logInput}
              onChange={(e) => setLogInput(e.target.value)}
              placeholder="Pega aquí el contenido del log..."
              className="w-full h-48 px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl 
                text-slate-200 placeholder-slate-500
                focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent
                font-mono text-sm resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            {/* Analyze Button */}
            <button
              onClick={analyzeLog}
              disabled={loading}
              className="flex-1 py-4 px-6 bg-gradient-to-r from-cyan-500 to-blue-500 
                text-white font-semibold rounded-xl
                hover:from-cyan-600 hover:to-blue-600
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200
                flex items-center justify-center gap-2 text-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analizando...
                </>
              ) : (
                <>
                  <AlertTriangle className="w-5 h-5" />
                  Analizar Log
                </>
              )}
            </button>

            {/* Clear Button */}
            <button
              onClick={clearAll}
              className="py-4 px-6 bg-gradient-to-r from-red-500 to-orange-500 
                text-white font-semibold rounded-xl
                hover:from-red-600 hover:to-orange-600
                transition-all duration-200
                flex items-center justify-center gap-2 text-lg"
            >
              <XCircle className="w-5 h-5" />
              Limpiar
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-500/20 border border-red-500 rounded-xl text-red-300">
              {error}
            </div>
          )}
        </div>

        {/* Results Section */}
        {analysis && (
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
                <Shield className="w-6 h-6 text-cyan-400" />
                Resultados del Análisis
              </h2>
              <button
                onClick={() => exportToPDF(Array.from(selectedForExport))}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 
                  text-white rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                Exportar PDF
              </button>
            </div>

            {/* SOC Format Output */}
            <div className="space-y-6">
              {(() => {
                const isMultiple = 'isMultiple' in analysis && analysis.isMultiple
                if (isMultiple) {
                  const multiAnalysis = analysis as MultipleLogAnalysis
                  return (
                    <>
                      {/* ESTADÍSTICAS */}
                      <div className="bg-slate-900/50 rounded-xl border border-slate-600 p-6">
                        <h3 className="text-lg font-bold text-cyan-400 mb-4 flex items-center gap-2">
                          <BarChart3 className="w-5 h-5" />
                          ESTADÍSTICAS
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          <div className="bg-slate-800 rounded-lg p-4">
                            <p className="text-slate-400 text-sm">Eventos analizados</p>
                            <p className="text-2xl font-bold text-white">{multiAnalysis.statistics.totalEvents}</p>
                          </div>
                          <div className="bg-slate-800 rounded-lg p-4">
                            <p className="text-slate-400 text-sm">Eventos únicos</p>
                            <p className="text-2xl font-bold text-white">{multiAnalysis.statistics.uniqueEvents}</p>
                          </div>
                          <div className="bg-red-900/30 rounded-lg p-4">
                            <p className="text-red-400 text-sm">Críticos</p>
                            <p className="text-2xl font-bold text-red-400">{multiAnalysis.statistics.riskDistribution.critical}</p>
                          </div>
                          <div className="bg-orange-900/30 rounded-lg p-4">
                            <p className="text-orange-400 text-sm">Altos</p>
                            <p className="text-2xl font-bold text-orange-400">{multiAnalysis.statistics.riskDistribution.high}</p>
                          </div>
                          <div className="bg-yellow-900/30 rounded-lg p-4">
                            <p className="text-yellow-400 text-sm">Medios</p>
                            <p className="text-2xl font-bold text-yellow-400">{multiAnalysis.statistics.riskDistribution.medium}</p>
                          </div>
                          <div className="bg-green-900/30 rounded-lg p-4">
                            <p className="text-green-400 text-sm">Bajos</p>
                            <p className="text-2xl font-bold text-green-400">{multiAnalysis.statistics.riskDistribution.low}</p>
                          </div>
                        </div>
                      </div>

                      {/* EVENTOS REPETIDOS */}
                      {multiAnalysis.repeatedEvents.length > 0 && (
                        <div className="bg-slate-900/50 rounded-xl border border-slate-600 p-6">
                          <h3 className="text-lg font-bold text-cyan-400 mb-4 flex items-center gap-2">
                            <Repeat className="w-5 h-5" />
                            EVENTOS REPETIDOS
                          </h3>
                          <ul className="space-y-2">
                            {multiAnalysis.repeatedEvents.map((event: any, index: number) => (
                              <li key={index} className="text-slate-200 bg-slate-800 p-3 rounded-lg flex items-center justify-between">
                                <span>{event.eventName}</span>
                                <span className={`font-bold ${getRiskColor(event.riskLevel)}`}>
                                  {event.count} veces
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* CORRELACIONES DE EVENTOS */}
                      {multiAnalysis.correlations && multiAnalysis.correlations.length > 0 && (
                        <div className="bg-gradient-to-r from-amber-900/50 to-orange-900/50 rounded-xl border border-amber-500 p-6">
                          <h3 className="text-lg font-bold text-amber-300 mb-4 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5" />
                            CORRELACIONES DE EVENTOS
                          </h3>
                          <ul className="space-y-3">
                            {multiAnalysis.correlations.map((correlation: any, index: number) => (
                              <li key={index} className="text-slate-200 bg-slate-800/50 p-3 rounded-lg">
                                <div className="flex items-start gap-2">
                                  <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                    correlation.severity === 'critical' ? 'bg-red-600' :
                                    correlation.severity === 'high' ? 'bg-orange-600' :
                                    'bg-yellow-600'
                                  } text-white`}>
                                    {index + 1}
                                  </span>
                                  <div>
                                    <p className="font-semibold text-amber-200">{correlation.description}</p>
                                    <p className="text-xs text-slate-400 mt-1">
                                      Tipo: {correlation.type} | Eventos relacionados: {correlation.eventIndices.length}
                                    </p>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* RESUMEN GENERAL */}
                      <div className="bg-slate-900/50 rounded-xl border border-slate-600 p-6">
                        <h3 className="text-lg font-bold text-cyan-400 mb-3">RESUMEN GENERAL</h3>
                        <p className="text-slate-200">{multiAnalysis.summary}</p>
                      </div>

                      {/* Toggle Vista Agrupada/Individual */}
                      {multiAnalysis.groupedEvents && multiAnalysis.groupedEvents.length > 0 && (
                        <div className="bg-slate-900/50 rounded-xl border border-slate-600 p-6">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-cyan-400">VISTA DE ANÁLISIS</h3>
                            <button
                              onClick={() => setShowGroupedView(!showGroupedView)}
                              className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 border border-cyan-500 rounded-lg hover:bg-cyan-500/30 transition-colors"
                            >
                              {showGroupedView ? (
                                <>
                                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                                  <span className="text-cyan-400 text-sm font-medium">Agrupada</span>
                                </>
                              ) : (
                                <>
                                  <span className="text-slate-400 text-sm font-medium">Individual</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Selección para exportación */}
                      <div className="bg-slate-900/50 rounded-xl border border-slate-600 p-6">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-bold text-cyan-400">SELECCIÓN PARA EXPORTACIÓN PDF</h3>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                const allIndices = multiAnalysis.individualAnalyses.map((_, index) => index)
                                setSelectedForExport(new Set(allIndices))
                              }}
                              className="flex items-center gap-2 px-3 py-1 bg-cyan-500/20 border border-cyan-500 rounded-lg hover:bg-cyan-500/30 transition-colors text-sm"
                            >
                              Seleccionar todos
                            </button>
                            <button
                              onClick={() => setSelectedForExport(new Set())}
                              className="flex items-center gap-2 px-3 py-1 bg-slate-700 border border-slate-600 rounded-lg hover:bg-slate-600 transition-colors text-sm"
                            >
                              Deseleccionar todos
                            </button>
                          </div>
                        </div>
                        <p className="text-slate-400 text-sm mt-2">
                          Eventos seleccionados: {selectedForExport.size} / {multiAnalysis.individualAnalyses.length}
                        </p>
                      </div>

                      {/* ANÁLISIS INDIVIDUALES */}
                      <div className="bg-slate-900/50 rounded-xl border border-slate-600 p-6">
                        <h3 className="text-lg font-bold text-cyan-400 mb-4">
                          {showGroupedView && multiAnalysis.groupedEvents && multiAnalysis.groupedEvents.length > 0
                            ? 'EVENTOS AGRUPADOS'
                            : 'ANÁLISIS INDIVIDUALES'}
                        </h3>
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                          {showGroupedView && multiAnalysis.groupedEvents && multiAnalysis.groupedEvents.length > 0 ? (
                            // Vista agrupada
                            multiAnalysis.groupedEvents.map((group: any, index: number) => (
                              <div key={index} className="bg-slate-800 rounded-lg overflow-hidden">
                                {/* Header del grupo - siempre visible */}
                                <div
                                  className={`p-4 hover:bg-slate-700 transition-colors ${
                                    group.correlations && group.correlations.length > 0 ? 'border-2 border-amber-500' : ''
                                  }`}
                                >
                                  <div className="flex items-start gap-3">
                                    <input
                                      type="checkbox"
                                      checked={group.indices.every((idx: number) => selectedForExport.has(idx))}
                                      onChange={(e) => {
                                        const newSelected = new Set(selectedForExport)
                                        if (e.target.checked) {
                                          group.indices.forEach((idx: number) => newSelected.add(idx))
                                        } else {
                                          group.indices.forEach((idx: number) => newSelected.delete(idx))
                                        }
                                        setSelectedForExport(newSelected)
                                      }}
                                      className="mt-1 w-4 h-4 accent-cyan-500"
                                    />
                                    <div className="flex-1 cursor-pointer" onClick={() => {
                                      const newExpanded = new Set(expandedGroups)
                                      if (newExpanded.has(index)) {
                                        newExpanded.delete(index)
                                      } else {
                                        newExpanded.add(index)
                                      }
                                      setExpandedGroups(newExpanded)
                                    }}>
                                      <div className="flex items-center gap-2">
                                        <span className="text-lg">{getRiskEmoji(group.riskLevel)}</span>
                                        <span className={`font-semibold ${getRiskColor(group.riskLevel)}`}>
                                          {group.eventName || 'Evento desconocido'}
                                        </span>
                                        <span className="bg-cyan-500/20 text-cyan-400 text-xs font-semibold px-2 py-1 rounded">
                                          {group.count}x
                                        </span>
                                        <span className="ml-auto text-slate-400">
                                          {expandedGroups.has(index) ? '▼' : '▶'}
                                        </span>
                                        {group.correlations && group.correlations.length > 0 && (
                                          <span className="flex items-center gap-1 text-amber-400 text-xs font-semibold">
                                            <AlertTriangle className="w-3 h-3" />
                                            RELACIONADO
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-slate-400 text-sm font-mono truncate mt-2">{group.firstLogLine}</p>
                                    </div>
                                  </div>
                                </div>

                                {/* Contenido del grupo - solo visible cuando está expandido */}
                                {expandedGroups.has(index) && (
                                  <div className="border-t border-slate-700 p-4 bg-slate-900/50">
                                    <p className="text-slate-300 text-sm font-semibold mb-3">
                                      Eventos individuales ({group.count}):
                                    </p>
                                    <div className="space-y-2 max-h-60 overflow-y-auto">
                                      {group.logLines.map((logLine: string, logIndex: number) => (
                                        <div
                                          key={logIndex}
                                          className="bg-slate-800 p-3 rounded text-slate-400 text-xs font-mono truncate"
                                        >
                                          {logLine}
                                        </div>
                                      ))}
                                    </div>
                                    {group.correlations && group.correlations.length > 0 && (
                                      <div className="mt-3 pt-3 border-t border-amber-500/30">
                                        <p className="text-amber-300 text-xs font-semibold mb-1">
                                          Correlaciones detectadas:
                                        </p>
                                        <div className="max-h-16 overflow-y-auto">
                                          {group.correlations.slice(0, 2).map((corr: any, corrIndex: number) => (
                                            <p key={corrIndex} className="text-slate-400 text-xs truncate">
                                              {corr.description}
                                            </p>
                                          ))}
                                          {group.correlations.length > 2 && (
                                            <p className="text-slate-500 text-xs italic">
                                              +{group.correlations.length - 2} correlaciones más...
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                    {group.responseProcedure && group.responseProcedure.length > 0 && (
                                      <div className="mt-3 pt-3 border-t border-slate-700">
                                        <p className="text-purple-300 text-xs font-semibold mb-2 flex items-center gap-1">
                                          <Shield className="w-3 h-3" />
                                          PASOS A SEGUIR ({group.responseProcedure.length})
                                        </p>
                                        <div className="max-h-20 overflow-y-auto">
                                          {group.responseProcedure.slice(0, 3).map((step: string, stepIndex: number) => (
                                            <p key={stepIndex} className="text-slate-400 text-xs truncate">
                                              {step}
                                            </p>
                                          ))}
                                          {group.responseProcedure.length > 3 && (
                                            <p className="text-slate-500 text-xs italic">
                                              +{group.responseProcedure.length - 3} pasos más...
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))
                          ) : (
                            // Vista individual
                            multiAnalysis.individualAnalyses.map((indAnalysis: any, index: number) => (
                              <div
                                key={index}
                                className={`bg-slate-800 rounded-lg p-4 hover:bg-slate-700 transition-colors ${
                                  indAnalysis.correlations && indAnalysis.correlations.length > 0 ? 'border-2 border-amber-500' : ''
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <input
                                    type="checkbox"
                                    checked={selectedForExport.has(index)}
                                    onChange={(e) => {
                                      const newSelected = new Set(selectedForExport)
                                      if (e.target.checked) {
                                        newSelected.add(index)
                                      } else {
                                        newSelected.delete(index)
                                      }
                                      setSelectedForExport(newSelected)
                                    }}
                                    className="mt-1 w-4 h-4 accent-cyan-500"
                                  />
                                  <div className="flex-1 cursor-pointer" onClick={() => setSelectedAnalysis(index)}>
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="text-lg">{getRiskEmoji(indAnalysis.riskLevel)}</span>
                                      <span className={`font-semibold ${getRiskColor(indAnalysis.riskLevel)}`}>
                                        {indAnalysis.eventName || 'Evento desconocido'}
                                      </span>
                                      {indAnalysis.correlations && indAnalysis.correlations.length > 0 && (
                                        <span className="ml-auto flex items-center gap-1 text-amber-400 text-xs font-semibold">
                                          <AlertTriangle className="w-3 h-3" />
                                          RELACIONADO
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-slate-400 text-sm font-mono truncate">{indAnalysis.logLine}</p>
                                    {indAnalysis.correlations && indAnalysis.correlations.length > 0 && (
                                      <div className="mt-2 pt-2 border-t border-amber-500/30">
                                        <p className="text-amber-300 text-xs font-semibold mb-1">
                                          Correlaciones detectadas:
                                        </p>
                                        <div className="max-h-16 overflow-y-auto">
                                          {indAnalysis.correlations.slice(0, 2).map((corr: any, corrIndex: number) => (
                                            <p key={corrIndex} className="text-slate-400 text-xs truncate">
                                              {corr.description}
                                            </p>
                                          ))}
                                          {indAnalysis.correlations.length > 2 && (
                                            <p className="text-slate-500 text-xs italic">
                                              +{indAnalysis.correlations.length - 2} correlaciones más...
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                    {indAnalysis.responseProcedure && indAnalysis.responseProcedure.length > 0 && (
                                      <div className="mt-3 pt-3 border-t border-slate-700">
                                        <p className="text-purple-300 text-xs font-semibold mb-2 flex items-center gap-1">
                                          <Shield className="w-3 h-3" />
                                          PASOS A SEGUIR ({indAnalysis.responseProcedure.length})
                                        </p>
                                        <div className="max-h-20 overflow-y-auto">
                                          {indAnalysis.responseProcedure.slice(0, 3).map((step: string, stepIndex: number) => (
                                            <p key={stepIndex} className="text-slate-400 text-xs truncate">
                                              {step}
                                            </p>
                                          ))}
                                          {indAnalysis.responseProcedure.length > 3 && (
                                            <p className="text-slate-500 text-xs italic">
                                              +{indAnalysis.responseProcedure.length - 3} pasos más...
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* DETALLE DEL ANÁLISIS SELECCIONADO */}
                      {selectedAnalysis !== null && multiAnalysis.individualAnalyses[selectedAnalysis] && (
                        <div className="bg-slate-900/50 rounded-xl border border-cyan-500 p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-cyan-400">DETALLE DEL EVENTO</h3>
                            <button
                              onClick={() => setSelectedAnalysis(null)}
                              className="text-slate-400 hover:text-white"
                            >
                              Cerrar
                            </button>
                          </div>
                          <SingleAnalysisView analysis={multiAnalysis.individualAnalyses[selectedAnalysis]} />
                        </div>
                      )}
                    </>
                  )
                } else {
                  const singleAnalysis = analysis as LogAnalysis
                  return (
                    <>
                      {/* RESUMEN */}
                      <div className="bg-slate-900/50 rounded-xl border border-slate-600 p-6">
                        <h3 className="text-lg font-bold text-cyan-400 mb-3">RESUMEN</h3>
                        <p className="text-slate-200">{singleAnalysis.summary}</p>
                      </div>

                      {/* RIESGO */}
                      <div className="bg-slate-900/50 rounded-xl border border-slate-600 p-6">
                        <h3 className="text-lg font-bold text-cyan-400 mb-3">RIESGO</h3>
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{getRiskEmoji(singleAnalysis.riskLevel)}</span>
                          <span className={`text-2xl font-bold ${getRiskColor(singleAnalysis.riskLevel)}`}>
                            {getRiskText(singleAnalysis.riskLevel)}
                          </span>
                        </div>
                      </div>

                      {/* CONFIANZA */}
                      <div className="bg-slate-900/50 rounded-xl border border-slate-600 p-6">
                        <h3 className="text-lg font-bold text-cyan-400 mb-3">CONFIANZA</h3>
                        <div className="flex items-center gap-3">
                          <span className={`text-2xl font-bold ${getConfidenceColor(singleAnalysis.confidence)}`}>
                            {getConfidenceText(singleAnalysis.confidence)}
                          </span>
                        </div>
                      </div>

                      {/* POSIBLE IMPACTO */}
                      <div className="bg-slate-900/50 rounded-xl border border-slate-600 p-6">
                        <h3 className="text-lg font-bold text-cyan-400 mb-3">POSIBLE IMPACTO</h3>
                        <p className="text-slate-200">{singleAnalysis.impact}</p>
                      </div>

                      {/* ACCIONES RECOMENDADAS */}
                      <div className="bg-slate-900/50 rounded-xl border border-slate-600 p-6">
                        <h3 className="text-lg font-bold text-cyan-400 mb-3">ACCIONES RECOMENDADAS</h3>
                        <ul className="space-y-2">
                          {singleAnalysis.recommendedActions.map((action: string, index: number) => (
                            <li key={index} className="text-slate-200 flex items-start gap-2">
                              <CheckCircle2 className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                              <span>{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* PRÓXIMAS VERIFICACIONES */}
                      <div className="bg-slate-900/50 rounded-xl border border-slate-600 p-6">
                        <h3 className="text-lg font-bold text-cyan-400 mb-3">PRÓXIMAS VERIFICACIONES</h3>
                        <ul className="space-y-2">
                          {singleAnalysis.nextChecks.map((check: string, index: number) => (
                            <li key={index} className="text-slate-200 flex items-start gap-2">
                              <Clock className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                              <span>{check}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* EVIDENCIAS */}
                      <div className="bg-slate-900/50 rounded-xl border border-slate-600 p-6">
                        <h3 className="text-lg font-bold text-cyan-400 mb-3">EVIDENCIAS</h3>
                        <ul className="space-y-2">
                          {singleAnalysis.evidences.map((evidence: string, index: number) => (
                            <li key={index} className="text-slate-200 flex items-start gap-2">
                              <XCircle className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                              <span className="font-mono text-sm">{evidence}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* PASOS A SEGUIR */}
                      {singleAnalysis.responseProcedure && singleAnalysis.responseProcedure.length > 0 && (
                        <div className="bg-gradient-to-r from-purple-900/50 to-indigo-900/50 rounded-xl border border-purple-500 p-6">
                          <h3 className="text-lg font-bold text-purple-300 mb-4 flex items-center gap-2">
                            <Shield className="w-6 h-6" />
                            PASOS A SEGUIR
                          </h3>
                          <ul className="space-y-3">
                            {singleAnalysis.responseProcedure.map((step: string, index: number) => (
                              <li key={index} className="text-slate-200 flex items-start gap-3">
                                <span className="flex-shrink-0 w-7 h-7 bg-purple-600 rounded-full flex items-center justify-center text-sm font-bold text-white">
                                  {index + 1}
                                </span>
                                <span className="leading-relaxed">{step}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  )
                }
              })()}

              {/* Timestamp */}
              <div className="text-center text-slate-400 text-sm">
                <Clock className="w-4 h-4 inline mr-1" />
                Análisis generado: {new Date(analysis.timestamp).toLocaleString()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
