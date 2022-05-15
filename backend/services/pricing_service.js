const model = require('./../models/bookingsModel');
const { HTTP_500 } = require('./../Utilities/http_utils');

/**
 * ROOM
 * min_guests
 * weekend_surge
 * festival_surge
 */

class PricingService {
    static guest_charge(guestInfo) {
        const { 
            total_guests,
            min_guests,
            guest_fee
        } = guestInfo;

        console.info("Guest info = ", guestInfo);

        return Math.min(
            0, 
            (total_guests - min_guests) * guest_fee
        );
    };

    static weekend_surge(date, surge) {
        const nd = new Date(date);
        if (nd.getDay() === 0 ||  nd.getDay() === 6) {
            // console.log("Weekend surge = ", surge);
            return surge;
        };
        return 0;
    };

    static festival_surge(date, surge) {
        const FESTIVALS = {
            "12/31": 1,
            "1/17": 1,
            "2/21": 1,
            "5/30": 1,
            "6/20": 1,
            "7/4": 1,
            "9/5": 1,
            "10/10": 1,
            "11/11": 1,
            "11/24": 1,
            "12/26": 1,
        };

        const nd = new Date(date);
        const festival = `${nd.getMonth()/nd.getDate()}`;

        // console.log("Festival Surge = ", surge);
        if (festival in FESTIVALS) return surge;
        return 0;
    };

    static surge_charge(surgeInfo) {
        const {
            start,
            end,
            week_end_surge,
            festival_surge
        } = surgeInfo;

        let charge = 0;
        const startDate = new Date(start);
        const endDate = new Date(end);
        
        for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
            charge += Math.max(
                this.weekend_surge(date, week_end_surge),
                this.festival_surge(date, festival_surge)
            )
        };

        console.log("Total Surge = ", charge);
        return charge; 
    };

    static customer_rewards() {
        return 0;
    };

    static get_base_fare(base_price, start, end) {
        let fare = 0;
        const startDate = new Date(start);
        const endDate = new Date(end);

        for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
            fare += base_price
        };

        return fare;
    };

    static calculateRoomPrice(pricingDetails) {
        const {
            base_fare,
            guest_charge, 
            surge_charge, 
            customer_rewards
        } = pricingDetails;
        console.log("calculateRoomPrice:: Details = ", pricingDetails);
        const price = base_fare + guest_charge + surge_charge - customer_rewards
        console.log("Pricing Details =", pricingDetails, price);
        return price;
    };
};

module.exports = PricingService;