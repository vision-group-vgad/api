import { describe, it } from "mocha";
import { expect } from "chai";

const vgad = "Vision Group Analytics Dashboard";
const returnInput = (input) => input;

describe("Test environment", function () {
  it("should return a string", function () {
    expect(returnInput(vgad)).to.equal("Vision Group Analytics Dashboard");
  });
});
