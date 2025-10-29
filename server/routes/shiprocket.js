// pages/api/shiprocket/track.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, message: 'Method not allowed' });
    }

    const { tracking_id } = req.body;

    if (!tracking_id) {
        return res.status(400).json({ success: false, message: 'Tracking ID is required' });
    }

    try {
        // Your ShipRocket API credentials
        const SHIPROCKET_EMAIL = process.env.SHIPROCKET_EMAIL;
        const SHIPROCKET_PASSWORD = process.env.SHIPROCKET_PASSWORD;
        const SHIPROCKET_BASE_URL = 'https://apiv2.shiprocket.in/v1/external';

        // First, get authentication token
        const authResponse = await fetch(`${SHIPROCKET_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: SHIPROCKET_EMAIL,
                password: SHIPROCKET_PASSWORD
            })
        });

        const authData = await authResponse.json();
        
        if (!authData.token) {
            throw new Error('Failed to authenticate with ShipRocket');
        }

        // Track shipment
        const trackResponse = await fetch(`${SHIPROCKET_BASE_URL}/courier/track?awb=${tracking_id}`, {
            headers: {
                'Authorization': `Bearer ${authData.token}`,
                'Content-Type': 'application/json'
            }
        });

        const trackData = await trackResponse.json();

        if (trackData.tracking_data) {
            res.status(200).json({
                success: true,
                data: trackData.tracking_data
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Tracking information not found'
            });
        }

    } catch (error) {
        console.error('ShipRocket tracking error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}