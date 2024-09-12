import { useStompClient, useSubscription } from 'react-stomp-hooks';
import './Canvas.css';
import { useEffect, useRef, useState, MouseEvent } from 'react';

interface Props {
    gameRoomID: string;
    isPainter: boolean;

}

const Canvas = ({ gameRoomID, isPainter }: Props) => {
    const canvasInput = useRef<HTMLCanvasElement>(null);
    const [holding, setHolding] = useState(false);
    const stompClient = useStompClient();
    const [color, setColor] = useState('red');


    const getContext = () => {
        if (canvasInput.current) {
            return canvasInput.current.getContext('2d');
        }
        return null;
    };

    useEffect(() => {
        const context = getContext();
        if (context) {

        }
    }, []);

    useSubscription("/topic/updatecanvas/" + gameRoomID, (message: any) => {
        const parsed = JSON.parse(message.body);
        setColor(parsed.color);
        const context = getContext();
        if (canvasInput.current && context) {
            drawImage(parsed.x, parsed.y, parsed.color);
        }
    });

    useSubscription("/topic/clearcanvas/" + gameRoomID, () => {
        const context = getContext();
        if (canvasInput.current && context) {
            context.clearRect(0, 0, canvasInput.current.width, canvasInput.current.height);
        }
    });

    const getMousePos = (canvas: HTMLCanvasElement, event: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    };

    const drawImage = (x: number, y: number, color: string) => {
        const context = getContext();
        if (canvasInput.current && context) {
            context.fillStyle = color;
            context.beginPath();
            context.arc(x + 5, y + 5, 5, 0, 2 * Math.PI);
            context.fill();
        }
    };

    const publishDraw = (x: number, y: number, color: string) => {
        if (stompClient) {
            stompClient.publish({
                destination: "/app/updatecanvase/" + gameRoomID,
                body: JSON.stringify({
                    x: x,
                    y: y,
                    color: color,
                }),
            });
        } else {
            console.error("No stomp client available.");
        }
    };

    const handleMouseDown = (event: MouseEvent) => {
        setHolding(true);
        const { x, y } = getMousePos(canvasInput.current!, event);
        drawImage(x, y, color);
        publishDraw(x, y, color);
    };

    const handleMouseMove = (event: MouseEvent) => {
        if (holding && canvasInput?.current) {
            const { x, y } = getMousePos(canvasInput.current, event);
            drawImage(x, y, color);
            publishDraw(x, y, color);
        }
    };

    const handleMouseUp = () => {
        setHolding(false);
    };

    const handleClearCanvas = () => {
        const context = getContext();
        if (canvasInput?.current && context) {
            context.clearRect(0, 0, canvasInput.current.width, canvasInput.current.height);
            if (stompClient) {
                stompClient.publish({
                    destination: "/app/clearcanvas/" + gameRoomID,
                    body: JSON.stringify({}),
                });
            }
        }
    };



    return (
        <div>

            {isPainter ? (
                <div>
                    <canvas
                        ref={canvasInput}
                        width="500"
                        height="500"
                        style={{ border: "1px solid red", backgroundColor: "white" }}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                    />
                    <div style={{ display: "flex", alignContent: "center", justifyContent: "center" }}>
                        <button onClick={() => setColor("red")}>Röd</button>
                        <button onClick={() => setColor("blue")}>Blå</button>
                        <button onClick={() => setColor("yellow")}>Gul</button>
                        <button onClick={() => setColor("green")}>Grön</button>
                        <button onClick={() => setColor("white")}>sudda</button>
                        <button onClick={handleClearCanvas}>CLEAR</button>
                    </div>
                </div>
            ) : (
                <canvas
                    ref={canvasInput}
                    width="500"
                    height="500"
                    style={{ border: "1px solid red", backgroundColor: "white" }}

                />
            )
            }
        </div>
    );
};

export default Canvas;
