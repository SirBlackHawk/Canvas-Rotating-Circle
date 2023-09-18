document.addEventListener("DOMContentLoaded", function () {
  let startTime = new Date().getTime();
  const paper = document.querySelector("canvas");
  const pen = paper.getContext("2d");

  let mousePosition = { x: 0, y: 0 };

  /**
   * Ruch myszy
   */
  paper.addEventListener("mousemove", function (event) {
    // Pobieramy pozycję kursora na canvasie
    var x = event.clientX - paper.getBoundingClientRect().left;
    var y = event.clientY - paper.getBoundingClientRect().top;

    mousePosition.x = x;
    mousePosition.y = y;
  });

  /**
   * Usunięcie kursora z pola canvas
   */
  paper.addEventListener("mouseleave", function (event) {
    mousePosition.x = 0;
    mousePosition.y = 0;
  });

  /**
   * Wylicza odległość międdzy dwoma pynktami
   *
   * @param {int} x1
   * @param {int} y1
   * @param {int} x2
   * @param {int} y2
   * @returns int
   */
  function getDistanceBetweenPoints(x1, y1, x2, y2) {
    var deltaX = x2 - x1;
    var deltaY = y2 - y1;

    // Obliczamy pierwiastek z kwadratu sumy kwadratów
    var distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

    return distance;
  }

  /**
   * Funkcja do rysowania po canvasie
   */
  const draw = () => {
    const currentTime = new Date().getTime();
    const elapsedTime = (currentTime - startTime) / 1000;

    paper.width = paper.clientWidth;
    paper.height = paper.clientHeight;

    pen.strokeStyle = "black";
    pen.lineWidth = 2;

    const lineLength = 10; // bazowa długość lini
    const padding = 30; // odległość od skraju canvasu
    const maxLength = padding; // maxymalna długość linii
    const minLength = 10; // minimalna długość linii
    const linesCount = 100; // ilość linii
    const angleDegrees = 360 / linesCount; // kąt w stopniach
    const angleRad = angleDegrees * (Math.PI / 180); // kąd w radianach
    const fromCenter = paper.width * 0.5 - lineLength - padding; // odległość od środka canvasu
    const velocity = 0.06; // prętkość obrotu
    const addedAngle = (Math.PI / 180) * (elapsedTime / velocity); // kąd o który należy obrucić linię

    for (i = 0; i < 360 / angleDegrees; i++) {
      const actualAngle = angleRad * i + addedAngle;

      const start = {
        x: paper.width / 2 + Math.cos(actualAngle) * fromCenter,
        y: paper.height / 2 + Math.sin(actualAngle) * fromCenter,
      };

      const distanceFromMouse = getDistanceBetweenPoints(
        start.x,
        start.y,
        mousePosition.x,
        mousePosition.y,
      );

      let newLineLength = 10;
      const maxDistanceFromMouse = 50;

      // wyliczam jak bardzo linia powinna się wydłużyć
      if (distanceFromMouse < maxDistanceFromMouse) {
        const proportion =
          1 - (distanceFromMouse - minLength) / maxDistanceFromMouse;
        newLineLength = minLength + proportion * (maxLength - minLength);
      }

      const end = {
        x:
          paper.width / 2 +
          Math.cos(actualAngle) * (fromCenter + newLineLength),
        y:
          paper.height / 2 +
          Math.sin(actualAngle) * (fromCenter + newLineLength),
      };

      pen.beginPath();
      pen.moveTo(start.x, start.y);
      pen.lineTo(end.x, end.y);
      pen.stroke();
    }

    requestAnimationFrame(draw);
  };

  draw();
});
