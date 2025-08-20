import moment from "moment";

export const BASE_URL = `https://api.sirz.co.uk`;
// export const BASE_URL = `http://localhost:5000`;


/**
 * Smoothly scrolls to an element with the specified ID
 * @param targetId - The ID of the element to scroll to (without the #)
 * @param options - Optional scroll options (default: { behavior: 'smooth', block: 'start' })
 */
export const scrollToElement = (
    targetId: string,
    options: ScrollIntoViewOptions = { behavior: 'smooth', block: 'start' }
  ): void => {
    if (!targetId) {
      console.warn('No target ID provided for scrollToElement');
      return;
    }
  
    const element = document.getElementById(targetId);
    
    if (!element) {
      console.warn(`Element with ID "${targetId}" not found`);
      return;
    }
  
    element.scrollIntoView(options);
  };

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