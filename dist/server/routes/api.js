import express from 'express';
const router = express.Router();
// Test route
router.get('/test', (req, res) => {
    res.json({ message: 'API is working!' });
});
// Projects route - will be expanded later
router.get('/projects', (req, res) => {
    // Mock data for now
    const projects = [
        {
            id: 1,
            title: "Cardiac Monitoring Device",
            description: "Developed a next-gen cardiac monitoring system",
            imageUrl: "/images/cardiac-device.jpg",
            details: "Led the development of a Class II medical device for continuous cardiac monitoring. Implemented quality management systems compliant with ISO 13485 and FDA regulations. Designed and validated the device through clinical trials.",
        },
        {
            id: 2,
            title: "Drug Delivery System",
            description: "Innovative drug delivery mechanism",
            imageUrl: "/images/drug-delivery.jpg",
            details: "Designed and implemented a novel drug delivery system with precise dosage control. Conducted risk analysis using FMEA methodology and implemented risk mitigation strategies. Collaborated with regulatory experts to ensure compliance with applicable standards.",
        }
    ];
    res.json(projects);
});
export default router;
