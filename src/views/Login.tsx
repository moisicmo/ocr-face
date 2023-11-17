import { Grid, Stack } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { ComponentButton, ComponentImage } from "@/components";
import { FormImageModel, FormImageValidations } from "@/models";
import { useForm } from "@/hooks";

const formFields: FormImageModel = {
  photo: ''
};
const formValidations: FormImageValidations = {
  photo: [(value: any) => value.length >= 1, 'Debe capturar la foto'],
};

export const Login = () => {
  const videoRef: any = useRef();
  const canvasVideoRef: any = useRef();
  let faceMatcher: any = null;

  const [imageCapture, setImageCapture] = useState<any>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [screenHeight, setScreenHeight] = useState((window.innerHeight / 2));
  const [screenWidth, setScreenWidth] = useState((window.innerWidth / 2) - 100);

  // type CaptureFunctionType = () => void;

  // const [captureFather, setCaptureFather] = useState<CaptureFunctionType>(null)


  const {
    photo,
    onImage64Change,
    isFormValid,
    photoValid
  } = useForm(formFields, formValidations);


  const loadModels = async () => {
    const uri = "/models";

    await faceapi.nets.tinyFaceDetector.loadFromUri(uri);
    await faceapi.nets.ssdMobilenetv1.loadFromUri(uri);
    await faceapi.nets.faceLandmark68Net.loadFromUri(uri);
    await faceapi.nets.faceRecognitionNet.loadFromUri(uri);
  };

  useEffect(() => {
    const handleResize = () => {
      setScreenHeight((window.innerHeight / 2));
      setScreenWidth((window.innerWidth / 2) - 100);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [window.innerHeight, window.innerWidth]);

  useEffect(() => {
    loadModels()
      .then(async () => {
        await scanFace();
        getLocalUserVideo();
      })
      .then(() => setModelsLoaded(true));
  }, []);

  const getLocalUserVideo = async () => {
    navigator.mediaDevices
      .getUserMedia({ audio: false, video: { facingMode: "user" } })
      .then((stream) => (videoRef.current.srcObject = stream))
      .catch((err) => console.error("error:", err));
  };

  const isFaceDetectionModelLoad = () => {
    return !!getCurrentFaceDetectionNet().params;
  };
  const getCurrentFaceDetectionNet = () => {
    return faceapi.nets.tinyFaceDetector;
  };

  function groupDescriptorsByName(faceDescriptors: any) {
    const groupedDescriptors: any = {};
    faceDescriptors.forEach(
      ({ descriptor }: { descriptor: any; detection: any }, index: number) => {
        let name = `person ${index}`;
        if (!groupedDescriptors[name]) {
          groupedDescriptors[name] = [];
        }
        groupedDescriptors[name].push(descriptor);
      }
    );
    return groupedDescriptors;
  }

  const scanFace = async () => {
    let options: any = null;
    let labeledDescriptors: any;
    if (isFaceDetectionModelLoad()) {
      options = new faceapi.TinyFaceDetectorOptions({
        inputSize: 288,
        scoreThreshold: 0.4,
      });
    }
    setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(videoRef.current, options)
        .withFaceLandmarks()
        .withFaceDescriptors();

      const groupedDescriptors: any = groupDescriptorsByName(detections);
      labeledDescriptors = Object.keys(groupedDescriptors).map((name) => {
        return new faceapi.LabeledFaceDescriptors(
          name,
          groupedDescriptors[name]
        );
      });
      if (labeledDescriptors.length > 0) {
        faceMatcher = new faceapi.FaceMatcher(labeledDescriptors);
      }

      const dims = faceapi.matchDimensions(
        canvasVideoRef.current,
        videoRef.current,
        true
      );
      const resizedDetections = faceapi.resizeResults(detections, dims);

      if (!canvasVideoRef.current) {
        return;
      }

      detections.forEach(({ detection, descriptor }: any) => {
        const label = faceMatcher.findBestMatch(descriptor).toString();

        const boxStyle = {
          label,
          lineWidth: 0.5,
          boxColor: "green",
          drawLabel: false,
          fontSize: 12,
        };
        const drawBox = new faceapi.draw.DrawBox(
          detection.box,
          boxStyle
        );

        drawBox.draw(canvasVideoRef.current);
      });
      faceapi.draw.drawFaceLandmarks(
        canvasVideoRef.current,
        resizedDetections
      );
    }, 50);
  };

  const handleClick = async (captureFather: any) => {
    console.log(captureFather)
    captureFather()
  }

  return (

    <Grid container justifyContent="center" alignItems="center">
      <Grid item xs={12} sm={6} >
        {/* contenido del carnet */}
        <ComponentImage
          onChange={(file: string) => {
            onImage64Change('photo', file);
            setImageCapture(file);
          }}
          error={!!photoValid && formSubmitted}
          helperText={formSubmitted ? photoValid : ''}
          isImage={imageCapture}
          reloadCamera={() => setImageCapture(null)}
          height={screenHeight}
          width={screenWidth}
          captureFather={handleClick}

        />
        {/* {
          imageCapture &&
          // <CardMedia component="img" image={imageCapture} style={mediaStyle} />
          <Stack>
            <img
              height={imageHeight}
              width={imageWidth}
              ref={imageRef}
              src={imageCapture}
              alt={imageCapture.fullName}
            />
            <canvas
              ref={canvasImageRef}
              style={{
                position: "absolute",
                display: localUserStream ? "block" : "none"
              }}
            />
          </Stack>
        } */}
      </Grid>
      <Grid item xs={12} sm={6} >
        {/* VIDEO DE REFERENCIA */}
        <Stack>
          <video
            muted
            autoPlay
            ref={videoRef}
            height={screenHeight}
            width={screenWidth}
            style={{
              objectFit: "fill",
              borderRadius: "10px",
            }}
          />
          <canvas
            ref={canvasVideoRef}
            style={{
              position: "absolute",
              height: screenHeight,
              width: screenWidth,
              pointerEvents: "none", // Ensure the canvas doesn't block interactions with the video

            }}
          />
        </Stack>
      </Grid>
      <ComponentButton onClick={handleClick} text="INGRESAR" />
    </Grid >

  );
};
