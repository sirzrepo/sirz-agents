export function parseTemplate(template: string, data: Record<string, string | number>) {
    return template.replace(/{{(.*?)}}/g, (_, key) => String(data[key.trim()] ?? ""));
  }  