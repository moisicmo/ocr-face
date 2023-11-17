import { FormImageModel, FormImageValidations } from "@/models";
import { useForm, useImageStore } from "@/hooks";
import * as faceapi from "face-api.js";
import { useEffect, useRef, useState } from "react";
import { Stack } from "@mui/material";
import { ComponentImage } from "@/components";

const formFields: FormImageModel = {
  photo: ''
};
const formValidations: FormImageValidations = {
  photo: [(value: any) => value.length >= 1, 'Debe capturar la foto'],
};

export const CaptureView = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [stateLoad, setStateLoad] = useState(false);
  const [imageCapture, setImageCapture] = useState<any>(null);
  const {
    photo,
    onImage64Change,
    isFormValid,
    photoValid
  } = useForm(formFields, formValidations);
  const { postSendImage } = useImageStore();

  const sendSubmit = (event: any) => {
    event.preventDefault();
    setFormSubmitted(true);
    if (!isFormValid) return;
    setStateLoad(true);
    postSendImage({ photo }).finally(() => {
      setImageCapture(null)
      setStateLoad(false)
    })
  };

  const [screenHeight, setScreenHeight] = useState(window.innerHeight);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenHeight(window.innerHeight);
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const mediaStyle: React.CSSProperties = {
    height: screenWidth > screenHeight ? screenHeight - 550 : screenWidth - 300,
    width: screenWidth > screenHeight ? screenHeight - 400 : screenWidth - 100,
    objectFit: 'cover',
  };




  // RECONOCIMIENTO FACIAL

  // const [tempAccount, setTempAccount] = useState<any>("");
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [localUserStream, setLocalUserStream] = useState<any>(null);
  const [faceApiLoaded, setFaceApiLoaded] = useState(false);
  const [loginResult, setLoginResult] = useState("PENDING");
  const [labeledFaceDescriptors, setLabeledFaceDescriptors] = useState<any>({});
  const videoRef: any = useRef();
  const imageRef: any = useRef();
  const canvasVideoRef: any = useRef();
  const canvasImageRef: any = useRef();
  const faceApiIntervalRef: any = useRef();
  const videoWidth = 640;
  const videoHeight = 360;
  const imageWidth = 640;
  const imageHeight = 360;
  let faceMatcher: any = null;


  const loadModels = async () => {
    // const uri = import.meta.env.DEV ? "/models" : "/react-face-auth/models";
    const uri = "/models";

    await faceapi.nets.tinyFaceDetector.loadFromUri(uri)
    await faceapi.nets.ssdMobilenetv1.loadFromUri(uri);
    await faceapi.nets.faceLandmark68Net.loadFromUri(uri);
    await faceapi.nets.faceRecognitionNet.loadFromUri(uri);
  };
  useEffect(() => {
    loadModels()
      .then(async () => {
        await scanFace();
        getLocalUserVideo();
      })
      .then(() => setModelsLoaded(true));
  }, []);

  const isFaceDetectionModelLoad = () => {
    return !!getCurrentFaceDetectionNet().params
  }
  const getCurrentFaceDetectionNet = () => {
    return faceapi.nets.tinyFaceDetector
  }
  const getLocalUserVideo = async () => {
    navigator.mediaDevices
      .getUserMedia({ audio: false, video: { facingMode: 'user' } })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        setLocalUserStream(stream);

        // loadLabeledImages();
      })
      .catch((err) => {
        console.error("error:", err);
      });
  };
  function groupDescriptorsByName(faceDescriptors: any) {
    const groupedDescriptors: any = {};
    faceDescriptors.forEach(({ descriptor, detection }: { descriptor: any, detection: any }, index: number) => {
      // const name = 'moises'; // Aquí deberías obtener el nombre de alguna manera
      let name = `person ${index}`
      if (!groupedDescriptors[name]) {
        groupedDescriptors[name] = [];
      }
      groupedDescriptors[name].push(descriptor);
    });
    return groupedDescriptors;
  }

  const scanFace = async () => {
    let options: any = null;
    let labeledDescriptors: any;
    if (isFaceDetectionModelLoad()) {
      options = new faceapi.TinyFaceDetectorOptions({ inputSize: 288, scoreThreshold: 0.7 })
    }
    faceapi.matchDimensions(canvasVideoRef.current, videoRef.current);
    setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(videoRef.current, options)
        .withFaceLandmarks()
        .withFaceDescriptors();


      const groupedDescriptors: any = groupDescriptorsByName(detections)
      labeledDescriptors = Object.keys(groupedDescriptors).map(name => {
        return new faceapi.LabeledFaceDescriptors(name, groupedDescriptors[name])
      })
      if (labeledDescriptors.length > 0) {
        faceMatcher = new faceapi.FaceMatcher(labeledDescriptors)
      }


      const dims = faceapi.matchDimensions(canvasVideoRef.current, videoRef.current, true)
      const resizedDetections = faceapi.resizeResults(detections, dims);

      // const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);

      // const results = resizedDetections.map((d) =>
      //   faceMatcher.findBestMatch(d.descriptor)
      // );

      if (!canvasVideoRef.current) {
        return;
      }

      canvasVideoRef.current
        .getContext("2d")
        .clearRect(0, 0, videoWidth, videoHeight);
      faceapi.draw.drawDetections(canvasVideoRef.current, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvasVideoRef.current, resizedDetections);

      // if (results.length > 0 && tempAccount.id === results[0].label) {
      //   setLoginResult("SUCCESS");
      // } else {
      //   setLoginResult("FAILED");
      // }
      // loadLabeledImages()

      if (!faceApiLoaded) {
        setFaceApiLoaded(true);
      }
      // console.log(labeledDescriptors)
      if (labeledDescriptors) {
        setLabeledFaceDescriptors(labeledDescriptors)
        if (imageCapture) {
          loadLabeledImages()
        }
      }
    }, 1000 / 15);
  };

  async function loadLabeledImages() {
    console.log('hi')

    const descriptions: any = [];
    let img: any;

    let options: any = null;
    if (isFaceDetectionModelLoad()) {
      // console.log("entra aca")
      options = new faceapi.TinyFaceDetectorOptions({ inputSize: 608, scoreThreshold: 0.6 })
      // console.log(options)
    }
    img = await faceapi.fetchImage(imageCapture.picture);

    const detections = await faceapi
      .detectAllFaces(img, options)
      .withFaceLandmarks()
      .withFaceDescriptors();

    if (detections) {
      const canvas = canvasImageRef.current
      faceapi.matchDimensions(canvas, imageRef.current)
      const resizedResults = faceapi.resizeResults(detections, imageRef.current)
      resizedResults.forEach(({ detection, descriptor }) => {
        const label = faceMatcher.findBestMatch(descriptor).toString()
        let options = null
        if (!label.includes('unknown')) {
          options = { label, boxColor: 'green' }
        } else {
          options = { label }
        }
        const drawBox = new faceapi.draw.DrawBox(detection.box, options)
        drawBox.draw(canvas)
      })
      faceapi.draw.drawFaceLandmarks(canvasImageRef.current, resizedResults);
    }
  }

  return (
    <>
      {/* VIDEO DE REFERENCIA */}
      <Stack>
        <video
          muted
          autoPlay
          ref={videoRef}
          height={videoHeight}
          width={videoWidth}
          style={{
            objectFit: "fill",
            borderRadius: "10px",
            display: localUserStream ? "block" : "none",
          }}
        />
        <canvas
          ref={canvasVideoRef}
          style={{
            position: "absolute",
            display: localUserStream ? "block" : "none",
          }}
        />
      </Stack>
      {/* VIDEO DE CONSULTA */}
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
      />
      {
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
      }

    </>

  );
}
