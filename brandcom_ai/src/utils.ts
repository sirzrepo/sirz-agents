import moment from "moment";

export const BASE_URL = `https://api.sirz.co.uk`;
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
    // Facebook: "https://www.facebook.com/share/15JPa4mdat/",
    Instagram: "https://www.instagram.com/femsantech/",
    Whatsapp: `https://wa.me/447407245685`,
    Linkedin: "https://www.linkedin.com/in/babafemi-sanusi-26a079320/"
};


export const authorName = "Babafemi Sanusi"