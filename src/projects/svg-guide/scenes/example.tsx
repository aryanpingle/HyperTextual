import "@/global.css";

import { Circle, makeScene2D, View2D, Node } from "@motion-canvas/2d";
import {
  all,
  createRef,
  createSignal,
  join,
  Reference,
  waitFor,
  delay,
} from "@motion-canvas/core";
import { Squircle } from "@/components/Squircle";
import { Slider } from "@/arkham/Slider";

export default makeScene2D(function* (view) {
  view.fill("black");

  yield* createDotsBackground(view);

  const RECT_WIDTH = createSignal(512);
  const RECT_HEIGHT = createSignal(512);
  const RX = createSignal(128);
  const RY = createSignal(128);
  const x = createSignal(0);
  const y = createSignal(0);

  const ARKHAM_GREEN = "#46fac3";
  const ARKHAM_RED = "#7bdefd";

  const squircle = createRef<Squircle>();

  const innerEllipsesNode = createRef<Node>();

  const contentRef = createRef<Node>();

  view.add(
    <Node ref={contentRef}>
      {/* RX */}
      <Slider
        label="rx"
        valueFunction={(fraction) => Math.round(fraction * 256)}
        x={() => -RECT_WIDTH() / 2}
        y={() => -(RECT_HEIGHT() / 2 + 100)}
        width={RECT_WIDTH}
        fraction={() => RX() / 256}
        stroke={"gray"}
        fill={ARKHAM_GREEN}
      ></Slider>
      {/* RY */}
      <Slider
        label="ry"
        valueFunction={(fraction) => Math.round(fraction * 256)}
        x={() => -RECT_WIDTH() / 2}
        y={() => RECT_HEIGHT() / 2 + 50}
        width={RECT_WIDTH}
        fraction={() => RY() / 256}
        stroke={"gray"}
        fill={ARKHAM_GREEN}
      ></Slider>
      <Squircle
        ref={squircle}
        x={x}
        y={y}
        width={RECT_WIDTH}
        height={RECT_HEIGHT}
        rx={RX}
        ry={RY}
        stroke={ARKHAM_GREEN}
        shadowBlur={2}
        shadowColor={ARKHAM_GREEN}
        lineWidth={16}
      ></Squircle>
      <Node ref={innerEllipsesNode}>
        <Circle
          x={() => -RECT_WIDTH() / 2 + RX()}
          y={() => -RECT_HEIGHT() / 2 + RY()}
          width={() => 2 * RX()}
          height={() => 2 * RY()}
          fill={ARKHAM_RED}
          lineWidth={16}
          opacity={0.2}
        />
        <Circle
          x={() => RECT_WIDTH() / 2 - RX()}
          y={() => -RECT_HEIGHT() / 2 + RY()}
          width={() => 2 * RX()}
          height={() => 2 * RY()}
          fill={ARKHAM_RED}
          lineWidth={16}
          opacity={0.2}
        />
        <Circle
          x={() => -RECT_WIDTH() / 2 + RX()}
          y={() => RECT_HEIGHT() / 2 - RY()}
          width={() => 2 * RX()}
          height={() => 2 * RY()}
          fill={ARKHAM_RED}
          lineWidth={16}
          opacity={0.2}
        />
        <Circle
          x={() => RECT_WIDTH() / 2 - RX()}
          y={() => RECT_HEIGHT() / 2 - RY()}
          width={() => 2 * RX()}
          height={() => 2 * RY()}
          fill={ARKHAM_RED}
          lineWidth={16}
          opacity={0.2}
        />
      </Node>
    </Node>,
  );

  // Hide inner ellipses
  innerEllipsesNode()
    .children()
    .forEach((node) => node.opacity(0));

  yield* contentRef().opacity(0, 0).to(1, 0.5);

  yield* waitFor(1);

  // Hide inner ellipses
  yield* all(
    ...innerEllipsesNode()
      .children()
      .map((node, index) => delay(index * 0.25, node.opacity(0.25, 0.75))),
  );
  yield* waitFor(1);

  yield* RX(256, 2).to(0, 2).to(128, 2);
  yield* RY(256, 2).to(0, 2).to(128, 2);

  yield* join(
    yield RY(256, 2).wait(2).to(0, 2).wait(2).to(128, 2),
    yield RX(256, 2).wait(2).to(0, 2).wait(2).to(128, 2),
  );

  yield* waitFor(1);
});

function* createDotsBackground(view: View2D) {
  const GCD = 120;
  const refsArray: Reference<Circle>[] = [];
  for (let i = 1; i < Math.round(1920 / GCD); ++i) {
    for (let j = 1; j < Math.round(1080 / GCD); ++j) {
      const ref = createRef<Circle>();
      view.add(
        <Circle
          ref={ref}
          x={i * GCD - 1920 / 2}
          y={j * GCD - 1080 / 2}
          fill={"#ffffff"}
          size={5}
        />,
      );
      refsArray.push(ref);
    }
  }

  yield* all(
    ...refsArray.map((circle, index) =>
      circle()
        .opacity(0, 0)
        .wait(index * 0.008)
        .to(1, 0.5)
        .to(0.25, 0.25),
    ),
  );
}