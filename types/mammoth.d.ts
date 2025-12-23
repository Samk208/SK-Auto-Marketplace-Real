declare module 'mammoth' {
  interface ConversionResult {
    value: string
    messages: Array<{
      type: string
      message: string
    }>
  }

  interface ConversionOptions {
    arrayBuffer?: ArrayBuffer
    buffer?: Buffer
    path?: string
  }

  export function convertToHtml(options: ConversionOptions): Promise<ConversionResult>
  export function convertToMarkdown(options: ConversionOptions): Promise<ConversionResult>
  export function extractRawText(options: ConversionOptions): Promise<ConversionResult>
}
