import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.*;

@SpringBootApplication
public class InteractiveMapBackend {
    public static void main(String[] args) {
        SpringApplication.run(InteractiveMapBackend.class, args);
    }
}

@RestController
@RequestMapping("/api")
class MapDataController {

    private static final String RAPIDAPI_KEY = "88eefc5240mshbf31c46ef44a36cp13f30ejsne7a353f4c274";

    // Get States
    @GetMapping("/states")
    public ResponseEntity<List<String>> getStates() {
        // Dummy data or API call to get states
        return ResponseEntity.ok(List.of("California", "Texas", "New York", "Florida", "Illinois"));
    }

    // Get Cities for a State
    @GetMapping("/cities")
    public ResponseEntity<List<String>> getCitiesByState(@RequestParam String state) {
        // Dummy implementation: Real implementation would use an API
        Map<String, List<String>> stateCities = Map.of(
                "California", List.of("San Francisco", "Los Angeles", "San Diego"),
                "Texas", List.of("Houston", "Dallas", "Austin")
        );
        return ResponseEntity.ok(stateCities.getOrDefault(state, List.of()));
    }

    // Get City and Real Estate Data
    @GetMapping("/city-data")
    public ResponseEntity<Map<String, Object>> getCityData(@RequestParam String city, @RequestParam String state) {
        Map<String, Object> response = new HashMap<>();

        // Dummy city info
        response.put("cityInfo", List.of(Map.of(
                "zip", "94103",
                "population", 883305,
                "latitude", 37.7749,
                "longitude", -122.4194
        )));

        // Dummy crime data
        response.put("crimeData", Map.of(
                "total_incidents", 120,
                "crime_rate", "5.5%"
        ));

        // Dummy unemployment data
        response.put("unemploymentData", Map.of(
                "rate", 4.2
        ));

        // Dummy mortgage data
        response.put("mortgageRateData", Map.of(
                "rate_30year_fixed", 6.3,
                "rate_15year_fixed", 5.1
        ));

        return ResponseEntity.ok(response);
    }

    // Get Real Estate Data
    @GetMapping("/real-estate")
    public ResponseEntity<Map<String, Object>> getRealEstateData(@RequestParam String id) {
        String url = "https://us-real-estate-listings.p.rapidapi.com/estimates";

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("x-rapidapi-key", RAPIDAPI_KEY);
        headers.set("x-rapidapi-host", "us-real-estate-listings.p.rapidapi.com");

        HttpEntity<Void> entity = new HttpEntity<>(headers);

        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(url)
                .queryParam("id", id);

        ResponseEntity<Map> response = restTemplate.exchange(builder.toUriString(), HttpMethod.GET, entity, Map.class);

        return ResponseEntity.ok(response.getBody());
    }
}
