create table tasks (
    id uuid not null primary key,
    user_id uuid references auth.users not null,
    task text
);

alter table tasks
    enable row level security;

create policy "Users can insert their own tasks" on tasks
    for insert with check ((select auth.uid() = user_id));

create policy "Users can update their own tasks" on tasks
    for update with check ((select auth.uid() = user_id));

create policy "Users can select their own tasks" on tasks
    for select using ((select auth.uid() = user_id));