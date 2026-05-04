create policy "household owners can delete households"
on public.households
for delete
using (
  exists (
    select 1
    from public.household_members hm
    where hm.household_id = id
      and hm.user_id = auth.uid()
      and hm.role = 'owner'
  )
);
