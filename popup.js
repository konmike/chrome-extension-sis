document.getElementById("download").onclick = () => {
  let col = document.getElementById("column").value;
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      args: [col],
      target: { tabId: tabs[0].id },
      function: getData,
    });
  });
};

function getData(col) {
  var tables = document.getElementsByTagName("table");
  var tab = tables.item(13);
  var n = tab.rows.length;
  let header = tab.rows[0];
  let col_title = header.cells[col].innerText;
  let subject = tab.rows[1].cells[4].innerText;
  let date = document.querySelector(".pozn2 b").innerText;
  var i,
    data = col_title,
    tr,
    td;

  // First check that col is not less then 0
  if (col < 0) {
    return null;
  }

  for (i = 1; i < n; i++) {
    tr = tab.rows[i];
    if (tr.cells.length > col) {
      // Check that cell exists before you try
      td = tr.cells[col]; // to access it.
      data += td.innerText + "\r\n";
    } // Here you could say else { return null; } if you want it to fail
    // when requested column is out of bounds. It depends.
  }

  let blob = new Blob(["\uFEFF" + data], {
    type: "text/csv; charset=utf-18",
  });
  let url = URL.createObjectURL(blob);
  let file = document.createElement(`a`);

  file.download = `${subject} - ${date}.csv`;
  file.href = url;
  document.body.appendChild(file);
  file.click();
  file.remove();
  URL.revokeObjectURL(url);
}
