var input = document.getElementById('search-bar');
var btns = document.getElementById('searchs');
btns.addEventListener('click', () => {
  const myNode = document.getElementById(
    'result-container'
  );
  while (myNode.lastElementChild) {
    myNode.removeChild(myNode.lastElementChild);
  }
  search = input.value.toLowerCase();
  var tags = document.querySelectorAll('a');
  var itemsArray = Array.from(tags);
  var container = document.getElementById(
    'result-container'
  );
  var filterd = itemsArray.filter(function (
    element,
    pos
  ) {
    return (
      element.innerHTML
        .toLocaleLowerCase()
        .includes(search) &&
      search != '' &&
      !element.innerHTML.includes('<') &&
      element.innerHTML != 'Skip to content' &&
      element.href !== ''
    );
  });

  if (filterd.length >= 1) {
    filterd.forEach(function (element) {
      var a = document.createElement('a');
      a.href = element.href;
      a.innerHTML = element.innerHTML;
      container.appendChild(a);
    });
  } else {
    var result = document.createElement('h1');
    result.innerHTML = 'No Result Found';
    container.appendChild(result);
  }
});
