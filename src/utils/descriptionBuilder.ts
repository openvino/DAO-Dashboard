export function DescriptionWithResources(
  description: string | undefined,
  resources: string[] | undefined
): string {
  const desc = typeof description === 'string' ? description.trim() : '';
  const resList =
    Array.isArray(resources) && resources.length > 0
      ? '\n\nResources:\n' + resources.map((r) => `- ${r}`).join('\n')
      : '';

  return desc + resList;
}
