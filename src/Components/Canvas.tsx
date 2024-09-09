import { useStompClient, useSubscription } from 'react-stomp-hooks';
import './Canvas.css';
import { useEffect, useRef, useState, MouseEvent } from 'react';

interface Props {
    gameRoomID: string;
}

const Canvas = ({ gameRoomID }: Props) => {
    const canvasInput = useRef<HTMLCanvasElement>(null);
    const context = canvasInput.current?.getContext("2d");
    const [holding, setHolding] = useState(false);
    const stompClient = useStompClient();
    const [color, setColor] = useState('red');
    // Prenumerera på kanvasuppdateringar från servern
    useSubscription("/topic/updatecanvas/" + gameRoomID, (message: any) => {
        console.log(message.body);
        let parsed = JSON.parse(message.body);
        console.log(parsed);

        if (canvasInput?.current && context) {
            drawImage(parsed.x, parsed.y);
        }
    });

    const getMousePos = (canvas: HTMLCanvasElement, event: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    };

    const drawImage = (x: number, y: number) => {
        if (canvasInput?.current && context) {
            context.fillStyle = color;
            context.beginPath();
            context.arc(x + 5, y + 5, 5, 0, 2 * Math.PI);
            context.fillStyle = color;
            context.fill();
        };


    };
    const publishDraw = (x: number, y: number) => {
        if (stompClient) {
            stompClient.publish({
                destination: "/app/updatecanvase/" + gameRoomID,
                body: JSON.stringify({
                    x: x,
                    y: y
                }),
            });
        } else {
            console.error("No stomp client available.");
        }
    };

    const handleMouseDown = (event: MouseEvent) => {
        setHolding(true);
        const { x, y } = getMousePos(canvasInput.current!, event);
        drawImage(x, y);
        publishDraw(x, y);
    };

    const handleMouseMove = (event: MouseEvent) => {
        if (holding && canvasInput?.current) {
            const { x, y } = getMousePos(canvasInput.current, event);
            drawImage(x, y);
            publishDraw(x, y);
        }
    };

    const handleMouseUp = () => {
        setHolding(false);
    };

    useEffect(() => {
        console.log(gameRoomID);
    }, [gameRoomID]);

    return (
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
            // För att stoppa rita om musen lämnar canvas
            ></canvas>
            <div style={{ display: "flex", alignContent: "center", justifyContent: "center" }}>
                <button onClick={() => setColor("red")}>Röd</button>
                <button onClick={() => setColor("blue")}>Blå</button>
                <button onClick={() => setColor("yellow")}>Gul</button>
                <button onClick={() => setColor("green")}>Grön</button>
                <button onClick={() => setColor("white")}>sudda</button>
                <button onClick={() => context?.clearRect(0, 0, 500, 500)}>CLEAR</button>

            </div>
            
        </div>
    );
};

export default Canvas;
