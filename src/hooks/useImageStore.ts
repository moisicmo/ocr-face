import { coffeApi } from "@/services";
import Swal from "sweetalert2";
//import { Buffer } from 'buffer';

export const useImageStore = () => {


    const postSendImage = async (body: object) => {
        try {
            const { data } = await coffeApi.post('/image', body);
            console.log(data)
            Swal.fire(`Genial! tu código es: ${data.codeImage}`, 'La imagen se envió', 'success');
        } catch (error) {
            Swal.fire('Oops ocurrio algo', '', 'error');
        }
        return true;
    }

    const getImage = async (image_id: string) => {
        try {
            //if (image_id === null) return '';
            //const response = await coffeApi.patch(`/image/photo/${image_id}`, {}, {
            //    responseType: 'arraybuffer',
            //});
            //const base64Image = Buffer.from(response.data, 'binary').toString('base64');
            //const objectURL = `data:image/jpeg;base64,${base64Image}`;
            //return objectURL;
        } catch (error) {
            Swal.fire('Oops no logramos encontrar tu imagen', '', 'error');
            return '';
        }
    }


    return {
        //* Métodos
        postSendImage,
        getImage,
    }

}