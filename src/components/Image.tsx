import { CameraAltTwoTone, Cameraswitch } from "@mui/icons-material";
import { Button, Card, IconButton } from "@mui/material";
import { useRef, useState, useEffect } from 'react';
import Webcam from "react-webcam";
import { Image } from "image-js";
import { createWorker } from 'tesseract.js';

export const ComponentImage = (props: any) => {
  const {
    onChange,
    error,
    helperText,
    reloadCamera,
    isImage,
    height,
    width,
    captureFather
  } = props;



  const webcamRef = useRef<any>(null);
  const [facingMode, setFacingMode] = useState("environment");

  const toggleCamera = () => {
    setFacingMode((prevFacingMode) =>
      prevFacingMode === "user" ? "environment" : "user"
    );
  };

  useEffect(() => {
    captureFather(capture)
  }, [])



  const videoConstraints = {
    height: height,
    width: width,
    facingMode: facingMode,
  };

  // const capture = async () => {
  async function capture() {
    console.log("no entra aca")
    const worker = await createWorker('eng');
    const imageSrc = webcamRef.current.getScreenshot();
    const image = await Image.load(imageSrc);
    const greyImage = image.grey();

    const ret = await worker.recognize(greyImage.toDataURL());
    console.log(ret.data.text);
    await worker.terminate();

    onChange(imageSrc);
  };

  const cardStyle: React.CSSProperties = {
    height: height,
    width: width,
    // height: width > height ? height - 750 : width - 300,
    // width: width > height ? height - 400 : width - 100,
    borderRadius: '5%',
    borderColor: error ? 'red' : 'initial',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  };

  const buttonsContainerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px',
  };

  const iconButtonStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderRadius: '50%',
  };

  const iconStyle: React.CSSProperties = {
    color: error ? 'red' : 'black',
    fontSize: '1.5rem',
  };

  const videoStyle: React.CSSProperties = {
    transform: facingMode === "user" ? "scaleX(-1)" : "scaleX(1)",
  };



  return (
    <>
      {!isImage && <Card style={cardStyle}>
        <Webcam
          audio={false}
          mirrored={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          style={videoStyle}
        />
      </Card>}
      {/* <div style={buttonsContainerStyle}>
                <IconButton style={iconButtonStyle} onClick={toggleCamera}>
                    <Cameraswitch style={iconStyle} />
                </IconButton>
                {isImage === null ? (
                    <IconButton style={iconButtonStyle} onClick={capture}>
                        <CameraAltTwoTone style={iconStyle} />
                    </IconButton>
                ) : (
                    <Button style={iconButtonStyle} onClick={() => reloadCamera()}>
                        {'REINTENTAR'}
                    </Button>
                )}
            </div> */}

      {error && <div style={{ color: 'red' }}>{helperText}</div>}
    </>
  );
}
