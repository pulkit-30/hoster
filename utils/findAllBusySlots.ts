const findAllBustSlots = (events: Record<string, any>) => {
  if (!events || !events.length) {
    return [];
  }
  return events.map(({ start, end, summary }: any) => {
    return {
      start,
      end,
      summary,
    };
  });
};
export default findAllBustSlots;
