import { useStompClient, useSubscription } from 'react-stomp-hooks';
import './Canvas.css';
import { useEffect, useRef, useState, MouseEvent } from 'react';
interface Props {
    gameRoomID: string

}
const Canvas = ({ gameRoomID }: Props) => {
    const canvasInput = useRef<HTMLCanvasElement>(null);
    const context = canvasInput.current?.getContext("2d");

    const stompClient = useStompClient();

    useSubscription("/topic/updatecanvas/" + gameRoomID, (message: any) => {

        console.log(message.body)
        let parsed = JSON.parse(message.body);
        console.log(parsed);
        
        if (canvasInput?.current && context) {
            drawImage(parsed.x,parsed.y)
        }

    });






    const getMousePos = (canvas: HTMLCanvasElement, evt: MouseEvent) => {
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    }



    const drawImage = (x: number, y: number) => {
        if (canvasInput?.current && context) {
            context.fillStyle = "green";
            context.fillRect(x, y, 10, 10);

        }
    };

    const handleClick = (event: MouseEvent) => {
        if (canvasInput?.current && context) {
            let { x, y } = getMousePos(canvasInput.current, event);

            drawImage(x, y);
            if (stompClient) {
                console.log(gameRoomID);
                console.log(x + y);

                stompClient.publish({
                    destination: "/app/updatecanvase/" + gameRoomID,
                    body: JSON.stringify({
                        x: x,
                        y: y
                    }),
                });
            } else {
                //Handle error
            }
        }
    };



    useEffect(() => {
        console.log(gameRoomID);

    }, [])

    return (
        <div>
            <canvas onClick={handleClick} ref={canvasInput}
                width="400"
                height="300"
                style={{ border: "1px solid white" }}
            ></canvas>
        </div>
    )
}

export default Canvas;