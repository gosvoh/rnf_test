window.addEventListener("DOMContentLoaded", function () {
  let timer = 5,
    timerStarted = false,
    counter = 0;

  let canvas = document.getElementById("main");

  let Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Composite = Matter.Composite,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    Events = Matter.Events,
    Vertices = Matter.Vertices;

  let engine = Engine.create();
  let render = Render.create({
    element: document.body,
    engine: engine,
    canvas: canvas,
    options: {
      width: 800,
      height: 600,
      wireframes: false,
      background: "transparent",
    },
  });

  let dragBody = null;
  Matter.Events.on(engine, "beforeUpdate", () => {
    if (dragBody == null) return;

    if (Math.abs(dragBody.velocity.x) > 1) {
      Body.setVelocity(dragBody, {
        x: dragBody.velocity.x > 0 ? 1 : -1,
        y: dragBody.velocity.y,
      });
    }
    if (Math.abs(dragBody.velocity.y) > 1) {
      Body.setVelocity(dragBody, {
        x: dragBody.velocity.x,
        y: dragBody.velocity.y > 0 ? 1 : -1,
      });
    }
    if (Math.abs(dragBody.positionImpulse.x) > 1)
      dragBody.positionImpulse.x = dragBody.positionImpulse.x > 0 ? 1 : -1;
    if (Math.abs(dragBody.positionImpulse.y) > 1)
      dragBody.positionImpulse.y = dragBody.positionImpulse.y > 0 ? 1 : -1;
  });

  let defaultCategory = 0x0001,
    ballCategory = 0x0002,
    passCategory = 0x0004,
    borderCategory = 0x0008,
    bucketCategory = 0x0016;

  let mouse = Mouse.create(render.canvas);
  let mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.01,
      render: {
        visible: false,
      },
    },
    collisionFilter: {
      category: defaultCategory,
      mask: ballCategory | passCategory | borderCategory,
    },
  });
  Composite.add(engine.world, mouseConstraint);
  render.mouse = mouse;

  Events.on(mouseConstraint, "startdrag", (_) => {
    _.body.collisionFilter.category = passCategory;
    Body.setStatic(_.body, false);
    dragBody = _.body;
  });

  Events.on(mouseConstraint, "enddrag", (_) => {
    _.body.collisionFilter.category = ballCategory;
    if (_.body.position.x > 315) Body.setStatic(_.body, false);
    else Body.setStatic(_.body, true);
    dragBody = null;
  });

  Events.on(engine, "collisionStart", (_) => {
    _.pairs.forEach((_) => {
      if (_.bodyB.collisionFilter.category === bucketCategory) {
        Composite.remove(engine.world, _.bodyA);
        counter++;
        if (!timerStarted) {
          timerStarted = true;
          let interval = setInterval(() => {
            timer--;
            if (timer < 0) {
              Render.stop(render);
              Runner.stop(runner);
              canvas
                .getContext("2d")
                .clearRect(0, 0, canvas.width, canvas.height);
              clearInterval(interval);
              let p = document.createElement("p");
              p.innerText = `You scored ${counter} points`;
              p.style.fontSize = "2rem";
              p.style.position = "absolute";
              p.style.top = "50%";
              p.style.left = "50%";
              p.style.transform = "translate(-50%, -50%)";
              document.body.appendChild(p);
              return;
            }
            text.render.text.content = timer.toString();
            return timer;
          }, 1000);
        }
      }
      if (_.bodyB.label === "ground") {
        Body.setPosition(_.bodyA, applesPositions[_.bodyA.id]);
        Body.setStatic(_.bodyA, true);
        Body.setAngle(_.bodyA, 0);
      }
    });
  });

  let bodies = [];
  let applesPositions = {};
  for (let i = 1; i <= 3; i++) {
    for (let j = 1; j <= 4; j++) {
      let apple = Bodies.circle(-25 + 100 * i, 100 + 100 * j, 30, {
        collisionFilter: {
          category: ballCategory,
          mask: defaultCategory | borderCategory | bucketCategory,
          group: -1,
        },
        label: "apple",
        slop: 0.5,
        friction: 1,
        frictionStatic: Infinity,
        render: {
          strokeStyle: "blue",
          sprite: {
            texture: "./apple.svg",
            xScale: 0.5,
            yScale: 0.5,
          },
        },
        isStatic: true,
      });
      applesPositions[apple.id] = {
        x: apple.position.x,
        y: apple.position.y,
      };
      bodies.push(apple);
    }
  }

  let bucketInnerVertices = Vertices.fromPath(
    "L 78.228 466.855 L 413.761 466.227 L 418.787 476.909 L 70.06 478.794 Z"
  );
  let bucketOuterVertices = Vertices.fromPath(
    "L 78.228 466.855 L 413.761 466.227 L 477.851 279.61 L 487.904 280.239 L 418.787 476.909 L 70.06 478.794 L 10.996 278.354 L 21.678 279.61 Z"
  );

  let options = {
    collisionFilter: {
      category: borderCategory,
      mask: passCategory | ballCategory,
    },
    render: {
      fillStyle: "black",
      strokeStyle: "transparent",
    },
    isStatic: true,
  };

  let obstacles = [
    Bodies.rectangle(400, -30, 800, 60, options),
    Bodies.rectangle(400, 600, 800, 60, {
      ...options,
      label: "ground",
    }),
    Bodies.rectangle(-30, 400, 60, 800, options),
    Bodies.rectangle(830, 400, 60, 800, options),
    Bodies.rectangle(350, 300, 1, 800, {
      isStatic: true,
      label: "another",
      collisionFilter: {
        category: borderCategory,
        mask: ballCategory,
      },
      render: { fillStyle: "transparent" },
    }),
  ];

  let bucketInner = Bodies.fromVertices(600, 400, bucketInnerVertices, {
    isSensor: true,
    isStatic: true,
    label: "deleter",
    collisionFilter: {
      category: bucketCategory,
      mask: passCategory | ballCategory,
    },
    render: {
      fillStyle: "transparent",
      lineWidth: 2,
      sprite: {
        texture: "./bucket.svg",
        xScale: 0.65,
        yScale: 0.65,
        yOffset: 0.35,
      },
    },
  });

  let bucketOuter = Bodies.fromVertices(600, 400, bucketOuterVertices, {
    isStatic: true,
    label: "bucket",
    collisionFilter: {
      category: defaultCategory,
      mask: passCategory | ballCategory,
    },
    render: {
      fillStyle: "transparent",
      strokeStyle: "transparent",
      lineWidth: 2,
    },
  });
  Body.scale(bucketInner, 0.55, 0.55);
  Body.scale(bucketOuter, 0.6, 0.6);

  let text = Bodies.rectangle(400, 25, 100, 50, {
    isStatic: true,
    render: {
      fillStyle: "transparent",
      text: {
        content: "15",
        color: "black",
        size: 50,
      },
    },
  });

  Composite.add(engine.world, [
    ...bodies,
    ...obstacles,
    bucketInner,
    bucketOuter,
    text,
  ]);

  Render.run(render);
  let runner = Runner.create();
  Runner.run(runner, engine);
});
