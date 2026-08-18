create policy "Admins can update roles"
on public.user_roles
for update
to authenticated
using (public.is_current_user_admin())
with check (public.is_current_user_admin());
