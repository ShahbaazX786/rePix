/**
 * converter.js
 * Shared logic for converting AVIF images to other formats using the HTML5 Canvas API.
 */

async function convertImageFile(file, outputMimeType, qualityValue = 0.9) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    
    img.onload = () => {
      // Create a canvas with the same dimensions as the image
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      
      // Export the canvas to a Blob in the requested format
      canvas.toBlob((blob) => {
        URL.revokeObjectURL(url); // Clean up memory
        if (!blob) {
          reject(new Error("Canvas conversion failed."));
          return;
        }
        resolve(blob);
      }, outputMimeType, qualityValue);
    };
    
    img.onerror = (e) => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image for conversion."));
    };
    
    img.src = url;
  });
}

function downloadBlob(blob, originalName, outputMimeType) {
  // Determine the correct file extension
  let extension = outputMimeType.split('/')[1]; // e.g. 'png', 'jpeg', 'webp'
  if (extension === 'jpeg') extension = 'jpg';
  
  // Strip the old extension (e.g. .avif) and add the new one
  const baseName = originalName.replace(/\.[^/.]+$/, "");
  const newFilename = `${baseName}.${extension}`;
  
  // Create a temporary link to trigger the download
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = newFilename;
  
  document.body.appendChild(a);
  a.click();
  
  // Clean up the DOM and memory
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}

// Stats Tracker (saves to chrome.storage.local)
async function incrementStats(format, count = 1) {
  const key = format === 'image/png' ? 'pngCount' : (format === 'image/jpeg' ? 'jpegCount' : 'webpCount');
  const result = await chrome.storage.local.get([key]);
  const current = result[key] || 0;
  await chrome.storage.local.set({ [key]: current + count });
}

// History Tracker (saves last 50 conversions)
async function logConversion(originalName, outputFormat, sizeKB) {
  const result = await chrome.storage.local.get(['historyLogs']);
  const logs = result.historyLogs || [];
  
  const newLog = {
    filename: originalName,
    format: outputFormat.split('/')[1].toUpperCase(),
    size: sizeKB,
    timestamp: new Date().toISOString()
  };
  
  logs.unshift(newLog); // Add to top
  if (logs.length > 50) logs.pop(); // Keep only last 50
  
  await chrome.storage.local.set({ historyLogs: logs });
}
