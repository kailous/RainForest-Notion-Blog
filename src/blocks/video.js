export function handleVideoBlock(block) {
    const { external, file } = block.video;
    const videoUrl = external ? external.url : file.url;
  
    return `<video controls class="my-4 w-full max-w-screen-md">
              <source src="${videoUrl}" type="video/mp4">
              Your browser does not support the video tag.
            </video>`;
  }