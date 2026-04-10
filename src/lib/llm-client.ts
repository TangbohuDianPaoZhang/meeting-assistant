export interface LlmSummaryInput {
  transcriptWindow: string[];
  previousSummary?: string;
}

export interface LlmSummaryOutput {
  topics: string[];
  decisions: string[];
  nextActions: string[];
  risks: string[];
}

/**
 * 调用LLM生成会议摘要（通过后端 API）
 */
export async function generateSummaryWithLlm(input: LlmSummaryInput): Promise<LlmSummaryOutput | null> {
  if (!input.transcriptWindow || input.transcriptWindow.length === 0) {
    console.warn("[LLM] 转录窗口为空，跳过摘要生成");
    return null;
  }

  console.log(`[LLM] 开始生成摘要，共 ${input.transcriptWindow.length} 条转录`);

  try {
    const response = await fetch('/api/llm/summary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        transcriptWindow: input.transcriptWindow,
        previousSummary: input.previousSummary
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[LLM] API 错误:', data.error);
      return null;
    }

    if (data.success) {
      console.log(`[LLM] 摘要生成成功: 主题=${data.topics?.length}, 决策=${data.decisions?.length}, 行动=${data.nextActions?.length}, 风险=${data.risks?.length}`);
      return {
        topics: data.topics || [],
        decisions: data.decisions || [],
        nextActions: data.nextActions || [],
        risks: data.risks || []
      };
    }

    return null;
  } catch (error) {
    console.error('[LLM] 请求失败:', error);
    return null;
  }
}

/**
 * 翻译文本到中文（双语对照格式）
 */
export async function translateText(text: string): Promise<string | null> {
  if (!text || text.trim().length === 0) {
    return null;
  }

  // 检测是否已经是中文
  const chineseRegex = /[\u4e00-\u9fa5]/;
  if (chineseRegex.test(text)) {
    return text;
  }

  try {
    const response = await fetch('/api/llm/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[翻译] API 错误:', data.error);
      return null;
    }

    return data.translation || null;
  } catch (error) {
    console.error('[翻译] 请求失败:', error);
    return null;
  }
}