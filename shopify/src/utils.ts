import moment from "moment";

export const BASE_URL = `https://api.sirz.co.uk`
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
    Facebook: "https://www.facebook.com/share/15JPa4mdat/",
    Instagram: "https://www.instagram.com/sirz_official",
    Whatsapp: ``,
    TikTok: "",
    Linkedin: "https://www.linkedin.com/company/sanz-innovation-retro/"
};


export const calendyLink = `https://calendly.com/sirz-support/1-hour-business-solutions-consult?month=2025-03`