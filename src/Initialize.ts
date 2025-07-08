import { setupDebugMode } from './Debug'
import { createPlanDropdown } from './InvestmentPlans'
import { populateChartInfoWithValues } from './ChartHelpers'
import { log, logError } from './Logger'

// Main initialization script
// Run this to set up all components of the budget system

export const initializeBudgetSystem = () => {
  log("=== BUDGET SYSTEM INITIALIZATION STARTED ===");

  try {
    // Set up debug mode first
    log("Setting up debug mode...");
    setupDebugMode();
    log("Debug mode setup complete");

    // Set up investment planner
    log("Setting up investment planner...");
    createPlanDropdown();
    log("Investment planner setup complete");

    // Set up chart info structure
    log("Setting up chart information...");
    populateChartInfoWithValues();
    log("Chart information setup complete");

    log("=== BUDGET SYSTEM INITIALIZATION COMPLETE ===");
    log("Debug mode: Disabled (toggle in V2 to enable)");
    log("Investment plans: Conservative Plan selected in M36 dropdown");

  } catch (error) {
    logError(error, "Initialization failed");
    throw error;
  }
}

// Individual setup functions for specific components
export const initializeDebugMode = () => {
  log("Initializing debug mode...")
  setupDebugMode()
  log("Debug mode initialized")
}

export const initializeInvestmentPlanner = () => {
  log("Initializing investment planner...")
  createPlanDropdown()
  log("Investment planner initialized")
}

export const initializeChartInfo = () => {
  log("Initializing chart information...")
  populateChartInfoWithValues()
  log("Chart information initialized")
} 