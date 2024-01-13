import villasModel from "@/models/villas.model"

export const config = {
    api: {
        bodyParser: false,
        externalResolver: true,
    },
};

export default async function handler(req, res){
    if(req.method == "GET"){
        try {
            const {villaId} = req.query;

            const villa = await villasModel.findById(villaId)
            return res.status(200).send(villa.name);
        } catch (error) {
            console.log(error)
            return res.status(500).send("Something went Wrong")
        }
    }
}