from fr24sdk.client import Client
from datetime import datetime, timezone, timedelta

# TEST API KEY -- Uses 0 api key credits to query but returns false data
api_token = "019ca545-ae71-731f-be21-82a9fed0ad69|o95d27QrcstvarZKoG3xJsgmoSNCWSOXMkF2nLcve2862b39"

# ACTUAL API KEY -- Uses around 110 api key credits to query
#api_token = "019ca548-a0fe-7011-b1b5-ba68aeddeee7|JN5YPrGT4pHFAQsMDqRZeNssRPXENsgg4JSCH1s8e62ba956"

def getData() -> dict:
    flightData = []
    with Client(api_token=api_token) as client:

        now_utc = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%S')

        try:
            # all flights inbound to LGW
            results = client.live.flight_positions.get_full(airports=["inbound:LGW"])

            # print table header
            print(f"--- Flights arriving at London Gatwick (LGW) ---")
            print(f"{'Flight':<10} {'Origin':<10} {'Destination':<10} {'Scheduled Arrival (UTC)':<25}")
            print("-" * 70)

            if results and results.data:
                for flight in results.data:
                    name = "n/a"
                    if flight.flight:
                        name = flight.flight
                    
                    origin = "n/a"
                    if flight.orig_iata:
                        origin = flight.orig_iata

                    dest = "n/a"
                    if flight.dest_iata:
                        dest = flight.dest_iata
                    
                    eta = "n/a"
                    if flight.eta:
                        eta = flight.eta

                    # print flight details
                    print(f"{name:<10} {origin:<10} {dest:<10} {eta:<25}")
                    flightData.append({"name":name, "origin":origin, "dest":dest, "eta":eta})

            else:
                print("No flight data found.")

        except Exception as e:
            print(f"An error occurred: {e}")
    return {"data":flightData}