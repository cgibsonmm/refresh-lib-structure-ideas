import { Box, Skeleton, Stack } from '@/theme/index';

export const ReactivationLoading = () => {
  return (
    <>
      <Box display="flex" justifyContent="center" alignItems="center" mt={10}>
        <Stack direction="row" spacing={2} justifyContent="center">
          <Stack direction="column" spacing={2}>
            <Skeleton
              width={320}
              height={30}
              variant="rounded"
              sx={{ mb: 2 }}
            />
          </Stack>
        </Stack>
      </Box>
      <Box display="flex" justifyContent="center" alignItems="center">
        <Stack direction="row" spacing={2} justifyContent="center">
          <Stack direction="column" spacing={2}>
            <Skeleton
              width={300}
              height={25}
              variant="rounded"
              sx={{ mb: 2 }}
            />
          </Stack>
        </Stack>
      </Box>
      <Box display="flex" justifyContent="center" alignItems="center" mt={5}>
        <Stack
          direction="row"
          spacing={{
            xs: 2,
            sm: 50,
            md: 150,
          }}
          justifyContent="space-between"
        >
          <Stack direction="column" spacing={2}>
            <Skeleton
              width={130}
              height={30}
              sx={{ mb: 2 }}
              variant="rounded"
            />
            <Skeleton
              width={130}
              height={30}
              sx={{ mb: 2 }}
              variant="rounded"
            />
          </Stack>
          <Stack direction="column" spacing={2}>
            <Skeleton
              width={130}
              height={30}
              sx={{ mb: 2 }}
              variant="rounded"
            />
            <Skeleton
              width={130}
              height={30}
              sx={{ mb: 2 }}
              variant="rounded"
            />
          </Stack>
        </Stack>
      </Box>
      <Box display="flex" justifyContent="center" alignItems="center" mt={10}>
        <Stack direction="row" spacing={2} justifyContent="center">
          <Stack direction="column" spacing={2}>
            <Skeleton
              width={300}
              height={35}
              variant="rounded"
              sx={{ mb: 2 }}
            />
          </Stack>
        </Stack>
      </Box>
    </>
  );
};
