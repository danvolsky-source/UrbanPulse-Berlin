import { describe, it, expect } from "vitest";

describe("Mapbox Token Validation", () => {
  it("should have valid Mapbox access token configured", async () => {
    const token = process.env.VITE_MAPBOX_ACCESS_TOKEN;
    
    // Check token exists
    expect(token).toBeDefined();
    expect(token).not.toBe("");
    
    // Check token format (Mapbox public tokens start with "pk.")
    expect(token?.startsWith("pk.")).toBe(true);
    
    // Validate token by making a simple API request to Mapbox
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/Berlin.json?access_token=${token}`
    );
    
    expect(response.ok).toBe(true);
    
    const data = await response.json();
    expect(data.features).toBeDefined();
    expect(data.features.length).toBeGreaterThan(0);
  });
});
