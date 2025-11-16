export const shareBlog = (blogId) => {
  if (!blogId) return;

  const url = `${window.location.origin}/readmore/${blogId}`;

  navigator.clipboard.writeText(url)
    .then(() => console.log("Copied URL:", url))
    .catch(err => console.error("Clipboard failed", err));
};
