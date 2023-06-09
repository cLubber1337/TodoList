import React, { ChangeEvent, memo, useCallback } from "react"
import { Box, Checkbox } from "@material-ui/core"
import { useTaskStyles } from "features/Task/task.styles"
import { useAppSelector } from "common/hooks/store.hook"
import { TextInputForm } from "common/components/TextInputForm"
import { TaskType } from "api/todolists.api"
import { TaskStatuses } from "common/enums"
import clsx from "clsx"
import { getAppStatus } from "app/app.selector"
import { useActions } from "common/hooks"
import { taskThunks } from "features/Task/task.slice"

type Props = {
  task: TaskType
  todolistId: string
}

export const Task = memo(({ task, todolistId }: Props) => {
  const classes = useTaskStyles()
  const { updateTasksThunk, deleteTasksThunk } = useActions(taskThunks)
  const status = useAppSelector(getAppStatus)

  const deleteTask = useCallback(() => {
    deleteTasksThunk({ todolistId, taskId: task.id })
  }, [todolistId, task.id])

  const changeTaskTitle = useCallback(
    (title: string) => {
      updateTasksThunk({ taskId: task.id, domainModel: { title }, todolistId })
    },
    [task.id, todolistId]
  )

  const onTaskStatusChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      updateTasksThunk({
        taskId: task.id,
        domainModel: {
          status: e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New,
        },
        todolistId,
      })
    },
    [task.id, todolistId]
  )

  return (
    <Box
      className={clsx(classes.content, task.status === TaskStatuses.Completed && classes.checked)}
    >
      <Checkbox
        onChange={onTaskStatusChange}
        checked={task.status === TaskStatuses.Completed}
        className={classes.checkbox}
        color={"primary"}
      />

      <TextInputForm
        className={classes}
        deleteCallBack={deleteTask}
        currentTitle={task.title}
        changeTitleCallBack={changeTaskTitle}
        toolTipTitle="Delete task"
        disabled={status === "loading"}
      />
    </Box>
  )
})
