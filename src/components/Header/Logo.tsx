import { Text } from "@chakra-ui/react";

export function Logo() {
    return (
        <Text
            // responsividade: o primeiro item representa mobile, e o segundo representa "a partir disso"
            fontSize={["2xl", "3xl"]}
            fontWeight="bold"
            letterSpacing="tight"
            w="64"
        >
            dashgo
            <Text as="span" ml="1" color="pink.500">
                .
            </Text>
        </Text>
    );
}