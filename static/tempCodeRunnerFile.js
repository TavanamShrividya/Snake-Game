function moveSnake(){
    const head = {x: snake[0].x + xVelocity,
                  y: snake[0].y + yVelocity};
    const addition1 = {x: snake[0].x + 2*xVelocity,
                        y: snake[0].y + 2*yVelocity};
    const addition2 = {x: snake[0].x + 3*xVelocity,
                        y: snake[0].y + 3*yVelocity};      
        if(goldenAppleEaten){
        if(head.x < 0) head.x = gameWidth - unitSize;
        else if(head.x >= gameWidth) head.x = 0;
        if(head.y < 0) head.y = gameHeight - unitSize;
        else if(head.y >= gameHeight) head.y = 0;
    }
             
    snake.unshift(head);
    //if food is eaten
    if(snake[0].x == foodX && snake[0].y == foodY){
        if(food == "pumpkinPie"){
            snake.unshift(addition1);
            snake.unshift(addition2);
            score+=3;
            scoreText.textContent = score;
        }
        else if(food == "carrot"){
            score+=1;
            scoreText.textContent = score;
        }
        else{
            snake.pop();
            goldenAppleEaten = true;
            immunityTimer = 50;
            displayTimer();
        }
        createFood();
    }
    else{
        snake.pop();
    }     
};