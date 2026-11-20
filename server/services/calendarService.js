import { initialEconomicCalendar } from '../data/initialData.js';

/**
 * PACIFIC CAPITAL NEWS - ECONOMIC CALENDAR SERVICE
 * 
 * Provides verifiable economic calendar tracking:
 * - Event name
 * - Country
 * - Date and time
 * - Importance level (HIGH, MEDIUM, LOW)
 * - Previous value
 * - Forecast
 * - Actual result
 * 
 * Never fabricates numbers or invents results.
 */
class EconomicCalendarService {
  constructor() {
    this.events = [...initialEconomicCalendar];
  }

  getEvents({ country, importance, dateFrom, dateTo } = {}) {
    let list = [...this.events];

    if (country && country !== 'ALL') {
      list = list.filter(e => e.countryCode === country || e.country.toLowerCase() === country.toLowerCase());
    }

    if (importance && importance !== 'ALL') {
      list = list.filter(e => e.importance === importance.toUpperCase());
    }

    if (dateFrom) {
      list = list.filter(e => e.date >= dateFrom);
    }

    if (dateTo) {
      list = list.filter(e => e.date <= dateTo);
    }

    // Sort by date and time
    list.sort((a, b) => new Date(`${a.date}T${a.time.split(' ')[0]}`).getTime() - new Date(`${b.date}T${b.time.split(' ')[0]}`).getTime());

    return list;
  }

  getEventById(id) {
    return this.events.find(e => e.id === id) || null;
  }
}

export const calendarService = new EconomicCalendarService();
