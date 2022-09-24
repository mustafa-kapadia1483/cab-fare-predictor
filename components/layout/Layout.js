import { useEffect, useRef, useState } from "react";
import {
  AppShell,
  Navbar,
  Header,
  Footer,
  Aside,
  Text,
  MediaQuery,
  Burger,
  useMantineTheme,
  ActionIcon,
  Group,
  Autocomplete,
  useMantineColorScheme,
} from "@mantine/core";
import { MoonStars, Sun } from "tabler-icons-react";
import axios from "axios";
import mapboxgl from "mapbox-gl";
import MapContainer from "../map/MapContainer";

export default function Layout({ children }) {
  const [pickupValue, setPickupValue] = useState("");
  const [pickupData, setPickupData] = useState([]);
  const [dropValue, setDropValue] = useState("");
  const [dropData, setDropData] = useState([]);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const [placesData, setPlacesData] = useState([]);
  const map = useRef(null);
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    let lat, long;
    navigator.geolocation.getCurrentPosition(async position => {
      lat = position.coords.latitude;
      long = position.coords.longitude;
      // console.log(position);

      const placesData = await axios
        .get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${lat},${long}.json`,
          {
            params: {
              access_token: process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN,
            },
          }
        )
        .then(res => res.data)
        .catch(function (error) {
          // handle error
          console.log(error);
        });
      // console.log("placesData", placesData);
      setPlacesData(placesData);
      setPickupData(
        placesData?.features?.map(({ place_name }) => place_name) ?? []
      );
    });
  }, []);

  const debounce = (func, delay = 1000) => {
    let timeoutId;
    // ..args will help pass the event arg to the func when called by the addEventListener in case of onInput
    return (...args) => {
      if (timeoutId) {
        clearInterval(timeoutId);
      }
      timeoutId = setTimeout(() => {
        // addEventListener will call this func (which is in turn the function passed to debounce) with arg of event in case of onInput
        func.apply(null, args);
      }, delay);
    };
  };

  const pickupChangeHandler = async () => {
    const data = await axios
      .get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${pickupValue}.json`,
        {
          params: {
            access_token: process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN,
            autocomplete: true,
            country: "IN",
          },
        }
      )
      .then(res => res.data)
      .catch(function (error) {
        // handle error
        console.log(error);
      });

    // console.log(data);
    setPlacesData(data);
    setPickupData(data?.features?.map(({ place_name }) => place_name));
  };

  const pickupItemSubmitHandler = item => {
    console.log(item);
    const pickupFeature = placesData.features.filter(
      ({ place_name }) => place_name === item.value
    )[0];

    const [lat, long] = pickupFeature.geometry.coordinates;

    const marker = new mapboxgl.Marker({ draggable: true })
      .setLngLat(pickupFeature.center)
      .addTo(map.current);

    console.log(marker.getLngLat());

    console.log("Pickup Feature", pickupFeature);
    console.log("Pickup Data", pickupData);
  };

  return (
    <AppShell
      padding={0}
      styles={{
        main: {
          background:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
        body: {
          height: "100%",
        },
      }}
      // navbarOffsetBreakpoint="sm"
      navbar={
        <Navbar p="md" hiddenBreakpoint={5000} hidden={!opened}>
          <Text>Cab Fare Predictor</Text>
        </Navbar>
      }
      header={
        <Header height={70} p="md">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              height: "100%",
              justifyContent: "space-between",
            }}
          >
            <Group>
              <MediaQuery largerThan="sm" styles={{ display: "none" }}>
                <Burger
                  opened={opened}
                  onClick={() => setOpened(o => !o)}
                  size="sm"
                  color={theme.colors.gray[6]}
                  mr="xl"
                />
              </MediaQuery>

              <Text>Cab Fare Predictor</Text>
            </Group>
            <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
              <Group>
                <Autocomplete
                  placeholder="Pickup Location"
                  value={pickupValue}
                  onChange={setPickupValue}
                  onKeyDown={debounce(pickupChangeHandler)}
                  onItemSubmit={pickupItemSubmitHandler}
                  data={pickupData}
                />
                <Autocomplete
                  placeholder="Drop Location"
                  value={dropValue}
                  onChange={setDropValue}
                  data={dropData}
                />
                <ActionIcon
                  variant="outline"
                  color={dark ? "yellow" : "blue"}
                  onClick={() => toggleColorScheme()}
                  title="Toggle color scheme"
                >
                  {dark ? <Sun size={18} /> : <MoonStars size={18} />}
                </ActionIcon>
              </Group>
            </MediaQuery>
          </div>
        </Header>
      }
    >
      <MapContainer map={map} />
      {children}
    </AppShell>
  );
}
