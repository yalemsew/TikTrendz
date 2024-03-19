$(document).ready(function () {
  const categories = ["Trending", "Comedy", "Music", "Dance"];

  categories.forEach((category) => {
    let rowId = `category-${category.replace(/\s+/g, "-")}`;
    $("#video-categories").append(`
            <div class="category">
                <h2>${category}</h2>
                <div class="video-row" id="${rowId}">
                    <!-- Videos will be added here -->
                </div>
                <div class="scroll-btn left" onclick="scrollRow('${rowId}', -200)">&#60;</div>
                <div class="scroll-btn right" onclick="scrollRow('${rowId}', 200)">&#62;</div>
            </div>
        `);
    fetchVideosForCategory(category, rowId);
  });
});

function fetchVideosForCategory(category, rowId) {
  // Simulated API response
  const exampleVideos = [
    { title: "Video 1", thumbnail: "https://via.placeholder.com/200x100" },
    { title: "Video 2", thumbnail: "https://via.placeholder.com/200x100" },
  ];
  exampleVideos.forEach((video) => {
    $(`#${rowId}`).append(
      `<div class="video-item"><img src="${video.thumbnail}" alt="${video.title}"></div>`
    );
  });
}

function scrollRow(rowId, scrollDistance) {
  document
    .getElementById(rowId)
    .scrollBy({ left: scrollDistance, behavior: "smooth" });
}
