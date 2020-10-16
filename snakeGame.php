<?php
 include 'header.php';
?>

<body id="">

  <h1> Snake Game </h1>

  <div id="snakeGame-messages"></div>

  <div id="snakeGameMap">
  </div>
  <br>
  <button id="resetButton" onclick="resetGame(24,50)">Reset</button>

  <script src="snakeGame.js"></script>
</body>

<?php
  include 'footer.php';
?>
