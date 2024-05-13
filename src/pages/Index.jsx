import React, { useRef, useState, useEffect } from "react";
import { Container, Box, Button, HStack, VStack, Text } from "@chakra-ui/react";
import { FaEraser, FaPaintBrush } from "react-icons/fa";

const Index = () => {
  const leftCanvasRef = useRef(null);
  const rightCanvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState(null);
  const [tool, setTool] = useState("brush");

  useEffect(() => {
    const canvas = leftCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      setContext(ctx);
    }
  }, []);

  const startDrawing = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    if (context) {
      context.beginPath();
      context.moveTo(offsetX, offsetY);
      setIsDrawing(true);
    }
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
    if (context) {
      context.lineTo(offsetX, offsetY);
      context.stroke();
      mirrorDrawing();
    }
  };

  const stopDrawing = () => {
    if (context) {
      context.closePath();
      setIsDrawing(false);
    }
  };

  const mirrorDrawing = () => {
    const leftCanvas = leftCanvasRef.current;
    const rightCanvas = rightCanvasRef.current;
    const rightCtx = rightCanvas.getContext("2d");
    rightCtx.clearRect(0, 0, rightCanvas.width, rightCanvas.height);
    rightCtx.drawImage(leftCanvas, 0, 0);
  };

  const clearCanvas = () => {
    if (context) {
      context.clearRect(0, 0, leftCanvasRef.current.width, leftCanvasRef.current.height);
      mirrorDrawing();
    }
  };

  const changeTool = (selectedTool) => {
    setTool(selectedTool);
    if (context) {
      context.strokeStyle = selectedTool === "brush" ? "black" : "white";
      context.lineWidth = selectedTool === "brush" ? 2 : 10;
    }
  };

  return (
    <Container centerContent maxW="container.xl" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4}>
        <Text fontSize="2xl">Draw on the left canvas and see the result on the right canvas</Text>
        <HStack spacing={4}>
          <Button onClick={() => changeTool("brush")} leftIcon={<FaPaintBrush />}>
            Brush
          </Button>
          <Button onClick={() => changeTool("eraser")} leftIcon={<FaEraser />}>
            Eraser
          </Button>
          <Button onClick={clearCanvas}>Clear</Button>
        </HStack>
        <HStack spacing={4}>
          <Box border="1px solid black">
            <canvas ref={leftCanvasRef} width={400} height={400} onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing} />
          </Box>
          <Box border="1px solid black">
            <canvas ref={rightCanvasRef} width={400} height={400} />
          </Box>
        </HStack>
      </VStack>
    </Container>
  );
};

export default Index;
