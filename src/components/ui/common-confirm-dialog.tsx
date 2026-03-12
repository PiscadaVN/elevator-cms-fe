import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'

interface CommonConfirmDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	title: string
	content: string
	cancelText: string
	submitText: string
	onSubmit: () => void
	isPending?: boolean
}

export function CommonConfirmDialog({
	open,
	onOpenChange,
	title,
	content,
	cancelText,
	submitText,
	onSubmit,
	isPending = false,
}: CommonConfirmDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{content}</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
						{cancelText}
					</Button>
					<Button variant="destructive" onClick={onSubmit} disabled={isPending}>
						{submitText}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
