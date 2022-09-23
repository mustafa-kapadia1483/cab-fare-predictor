import { useState } from "react";
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
  TextInput,
  Group,
  Autocomplete,
} from "@mantine/core";
import axios from "axios";

export default function Layout({ children }) {
  const [value, setValue] = useState("");
  const [data, setData] = useState([]);
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);

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
      .get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${value}.json`, {
        params: {
          access_token: process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN,
          autocomplete: true,
        },
      })
      .then(res => res.data)
      .catch(function (error) {
        // handle error
        console.log(error);
      });

    console.log(data);

    setData(data?.features?.map(({ place_name }) => place_name));
  };

  return (
    <AppShell
      styles={{
        main: {
          background:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
          // padding: 1,
        },
        body: {
          height: "100%",
        },
      }}
      navbarOffsetBreakpoint="xl"
      navbar={
        <Navbar
          p="md"
          hiddenBreakpoint={5000}
          hidden={!opened}
          width={{ sm: 200, lg: 300 }}
        >
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
            <Group>
              <Autocomplete
                placeholder="Pickup Location"
                value={value}
                onChange={setValue}
                onKeyDown={debounce(pickupChangeHandler)}
                data={data}
              />
              {/* <Autocomplete
                placeholder="Drop Location"
                value={value}
                onChange={setValue}
                data={[]}
              /> */}
            </Group>
          </div>
        </Header>
      }
    >
      {children}
    </AppShell>
  );
}
