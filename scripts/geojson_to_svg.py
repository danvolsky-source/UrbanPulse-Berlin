#!/usr/bin/env python3
"""
Convert Berlin GeoJSON boundary to SVG path for clipPath
"""
import json
import sys

def geojson_to_svg_path(geojson_file, width=700, height=500):
    """Convert GeoJSON coordinates to SVG path string"""
    
    with open(geojson_file, 'r') as f:
        data = json.load(f)
    
    # Get all coordinates from all features
    all_coords = []
    for feature in data['features']:
        geom = feature['geometry']
        if geom['type'] == 'Polygon':
            # Polygon has array of rings (first is outer boundary)
            coords = geom['coordinates'][0]
            all_coords.extend(coords)
        elif geom['type'] == 'MultiPolygon':
            # MultiPolygon has array of polygons
            for polygon in geom['coordinates']:
                coords = polygon[0]  # outer ring
                all_coords.extend(coords)
    
    if not all_coords:
        print("No coordinates found!", file=sys.stderr)
        return None
    
    # Find bounding box
    lons = [c[0] for c in all_coords]
    lats = [c[1] for c in all_coords]
    
    min_lon, max_lon = min(lons), max(lons)
    min_lat, max_lat = min(lats), max(lats)
    
    print(f"Bounding box: lon [{min_lon}, {max_lon}], lat [{min_lat}, {max_lat}]", file=sys.stderr)
    
    # Convert to SVG coordinates
    def project(lon, lat):
        # Simple linear projection to fit in viewBox
        x = ((lon - min_lon) / (max_lon - min_lon)) * width
        # Flip Y because SVG Y goes down
        y = height - ((lat - min_lat) / (max_lat - min_lat)) * height
        return x, y
    
    # Build SVG path
    path_parts = []
    
    for feature in data['features']:
        geom = feature['geometry']
        
        if geom['type'] == 'Polygon':
            coords = geom['coordinates'][0]
            if coords:
                x, y = project(coords[0][0], coords[0][1])
                path_parts.append(f"M {x:.2f} {y:.2f}")
                for lon, lat in coords[1:]:
                    x, y = project(lon, lat)
                    path_parts.append(f"L {x:.2f} {y:.2f}")
                path_parts.append("Z")
        
        elif geom['type'] == 'MultiPolygon':
            for polygon in geom['coordinates']:
                coords = polygon[0]
                if coords:
                    x, y = project(coords[0][0], coords[0][1])
                    path_parts.append(f"M {x:.2f} {y:.2f}")
                    for lon, lat in coords[1:]:
                        x, y = project(lon, lat)
                        path_parts.append(f"L {x:.2f} {y:.2f}")
                    path_parts.append("Z")
    
    return " ".join(path_parts)


if __name__ == "__main__":
    geojson_file = sys.argv[1] if len(sys.argv) > 1 else "berlin_boundary.geojson"
    
    svg_path = geojson_to_svg_path(geojson_file)
    
    if svg_path:
        print(svg_path)
    else:
        sys.exit(1)
