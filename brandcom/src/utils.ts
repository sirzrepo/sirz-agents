import moment from "moment";

export const BASE_URL = `https://sirz-xfqp.onrender.com`;
// export const BASE_URL = `http://localhost:5000`;

export const formatDate = (date: string) => {
    const formattedDate = moment(date).format('MMMM D, YYYY');
    return formattedDate
}

export const formatDateTime = (date: string) => {
    const formattedDate = moment(date).format('ddd MMM D YYYY, HH:mm:ss');
    return formattedDate
};

export const socialLinks = {
    Facebook: "",
    Instagram: "",
    Whatsapp: ``,
    TikTok: ""
};


export const calendyLink = `https://calendly.com/sirz-support/1-hour-business-solutions-consult?month=2025-03`