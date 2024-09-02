import './Canvas.css';
import { useEffect, useRef, useState, MouseEvent } from 'react';

const DrawingCanvas: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);

    const [isDrawing, setIsDrawing] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.width = 500;
        canvas.height = 500;

        const context = canvas.getContext("2d");
        if (context) {
            context.lineCap = "round";
            context.strokeStyle = "black";
            context.lineWidth = 5;
            contextRef.current = context;
        }
    }, []);

    const startDrawing = ({ nativeEvent }: MouseEvent<HTMLCanvasElement>) => {
        const { offsetX, offsetY } = nativeEvent;
        const context = contextRef.current;
        if (!context) return;

        context.beginPath();
        context.moveTo(offsetX, offsetY);
        context.lineTo(offsetX, offsetY);
        context.stroke();
        setIsDrawing(true);
        nativeEvent.preventDefault();
    };

    const draw = ({ nativeEvent }: MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;

        const { offsetX, offsetY } = nativeEvent;
        const context = contextRef.current;
        if (!context) return;

        context.lineTo(offsetX, offsetY);
        context.stroke();
        nativeEvent.preventDefault();
    };

    const stopDrawing = () => {
        const context = contextRef.current;
        if (context) {
            context.closePath();
        }
        setIsDrawing(false);
    };

    const setToDraw = () => {
        const context = contextRef.current;
        if (context) {
            context.globalCompositeOperation = 'source-over';
        }
    };

    const setToErase = () => {
        const context = contextRef.current;
        if (context) {
            context.globalCompositeOperation = 'destination-out';
        }
    };

    const setToClear = () => {
        const context = contextRef.current;
        if (context) {
            context.clearRect(0, 0, 500, 500);
        }
    };

    const saveImageToLocal = (event: MouseEvent<HTMLAnchorElement>) => {
        const link = event.currentTarget;
        const canvas = canvasRef.current;
        if (!canvas) return;

        link.setAttribute('download', 'canvas.png');
        const image = canvas.toDataURL('image/png');
        link.setAttribute('href', image);
    };

    return (
        <div>
            <canvas className="canvas-container"
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}>
            </canvas>
            <div style={{ display: 'flex', gap: '20px' }}>
                <button onClick={setToDraw}>
                    Draw
                </button>
                <button onClick={setToClear}>
                    Clear
                </button>
                <button onClick={setToErase}>
                    Erase
                </button>
                <a id="download_image_link" href="download_link" onClick={saveImageToLocal}>Download Image</a>
            </div>
        </div>
    );
}

export default DrawingCanvas;
