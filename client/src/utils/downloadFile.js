export const downloadFile = async (fileUrl, originalName) => {
  if (!fileUrl) return;

  const safeFilename = originalName || fileUrl.split('/').pop() || 'download';

  try {
    const response = await fetch(fileUrl, { method: 'GET' });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', safeFilename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Frontend download failed, attempting fallback:", error);
    const fallbackLink = document.createElement('a');
    fallbackLink.href = fileUrl;
    fallbackLink.target = '_blank';
    fallbackLink.rel = 'noopener noreferrer';
    fallbackLink.download = safeFilename;
    document.body.appendChild(fallbackLink);
    fallbackLink.click();
    document.body.removeChild(fallbackLink);
  }
};
