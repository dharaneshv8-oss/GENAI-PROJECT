import { Story } from '../types';

export function formatStoryAsText(story: Story): string {
  const divider = '='.repeat(60);
  const subDivider = '-'.repeat(40);

  let text = `${divider}\n`;
  text += `${story.title.toUpperCase()}\n`;
  text += `Genre: ${story.genre} | Style: ${story.style} | Length: ${story.lengthSetting}\n`;
  text += `Language: ${story.language} | Words: ${story.wordCount} | Created: ${new Date(story.createdAt).toLocaleDateString()}\n`;
  text += `${divider}\n\n`;

  text += `SYNOPSIS:\n${story.summary}\n\n`;

  if (story.keyCharacters && story.keyCharacters.length > 0) {
    text += `KEY CHARACTERS:\n${story.keyCharacters.map((c) => `• ${c}`).join('\n')}\n\n`;
  }

  text += `${subDivider}\nACT I: THE BEGINNING\n${subDivider}\n\n`;
  text += `${story.beginning}\n\n`;

  text += `${subDivider}\nACT II: THE MIDDLE\n${subDivider}\n\n`;
  text += `${story.middle}\n\n`;

  text += `${subDivider}\nACT III: THE RESOLUTION\n${subDivider}\n\n`;
  text += `${story.ending}\n\n`;

  if (story.continuations && story.continuations.length > 0) {
    story.continuations.forEach((cont, idx) => {
      text += `\n${subDivider}\nCONTINUATION ${idx + 1}: ${cont.chapterTitle.toUpperCase()}\n${subDivider}\n\n`;
      text += `${cont.continuationText}\n\n`;
      if (cont.cliffhangerOrHook) {
        text += `Upcoming Hook: ${cont.cliffhangerOrHook}\n\n`;
      }
    });
  }

  text += `${divider}\n`;
  text += `THEME / MORAL: ${story.moralOrTheme}\n`;
  text += `Created with AI Story Creator (Powered by Google Gemini AI)\n`;
  text += `${divider}\n`;

  return text;
}

export function downloadFile(filename: string, content: string, mimeType: string = 'text/plain') {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadStoryTxt(story: Story): void {
  const content = formatStoryAsText(story);
  const safeTitle = story.title.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 40);
  downloadFile(`${safeTitle}.txt`, content, 'text/plain');
}

export function downloadStoryMarkdown(story: Story): void {
  let md = `# ${story.title}\n\n`;
  md += `> **Genre**: ${story.genre} | **Style**: ${story.style} | **Word Count**: ${story.wordCount}\n\n`;
  md += `## Synopsis\n${story.summary}\n\n`;

  if (story.keyCharacters && story.keyCharacters.length > 0) {
    md += `### Characters\n`;
    story.keyCharacters.forEach((char) => {
      md += `- ${char}\n`;
    });
    md += `\n`;
  }

  md += `## Part 1: The Beginning\n${story.beginning}\n\n`;
  md += `## Part 2: The Turning Point\n${story.middle}\n\n`;
  md += `## Part 3: The Climax & Ending\n${story.ending}\n\n`;

  if (story.continuations && story.continuations.length > 0) {
    story.continuations.forEach((cont, i) => {
      md += `## Chapter ${i + 2}: ${cont.chapterTitle}\n${cont.continuationText}\n\n`;
    });
  }

  md += `---\n**Theme / Insight**: *${story.moralOrTheme}*\n\n`;
  md += `*Crafted with AI Story Creator — Powered by Google Gemini AI*\n`;

  const safeTitle = story.title.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 40);
  downloadFile(`${safeTitle}.md`, md, 'text/markdown');
}

export async function copyStoryToClipboard(story: Story): Promise<boolean> {
  const text = formatStoryAsText(story);
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Clipboard copy failed:', err);
    return false;
  }
}
